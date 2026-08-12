package com.example.emailcampaign.kafka.consumer;

import com.example.emailcampaign.campaign.domain.CampaignContact;
import com.example.emailcampaign.campaign.domain.CampaignContactId;
import com.example.emailcampaign.campaign.domain.CampaignContactStatus;
import com.example.emailcampaign.campaign.domain.Campaign;
import com.example.emailcampaign.campaign.repository.CampaignContactRepository;
import com.example.emailcampaign.campaign.repository.CampaignRepository;
import com.example.emailcampaign.config.AppProperties;
import com.example.emailcampaign.email.EmailMessage;
import com.example.emailcampaign.email.EmailProvider;
import com.example.emailcampaign.kafka.KafkaTopics;
import com.example.emailcampaign.kafka.message.EmailContactInfo;
import com.example.emailcampaign.kafka.message.EmailSendBatchMessage;
import com.example.emailcampaign.kafka.message.TrackingEventMessage;
import com.example.emailcampaign.ratelimit.RateLimitExceededException;
import com.example.emailcampaign.ratelimit.RateLimiterService;
import com.example.emailcampaign.template.service.TemplateRenderer;
import com.example.emailcampaign.tracking.repository.TrackingTokenRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.BackOff;
import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.retrytopic.TopicSuffixingStrategy;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailSenderConsumer {

    private final CampaignRepository campaignRepository;
    private final CampaignContactRepository campaignContactRepository;
    private final TrackingTokenRepository trackingTokenRepository;
    private final TemplateRenderer templateRenderer;
    private final EmailProvider emailProvider;
    private final RateLimiterService rateLimiterService;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final AppProperties appProperties;

    @RetryableTopic(
            attempts = "3",
            backOff = @BackOff(delay = 10_000, multiplier = 2),
            topicSuffixingStrategy = TopicSuffixingStrategy.SUFFIX_WITH_INDEX_VALUE,
            dltTopicSuffix = ".dlt",
            exclude = {JsonProcessingException.class}
    )
    @KafkaListener(topics = KafkaTopics.EMAIL_SEND_BATCHES, groupId = "email-sender-pool", concurrency = "4")
    public void consume(String payload) throws JsonProcessingException {
        EmailSendBatchMessage batch = objectMapper.readValue(payload, EmailSendBatchMessage.class);

        Campaign campaign = campaignRepository.findByIdWithTemplate(batch.campaignId())
                .orElseThrow(() -> new IllegalStateException("Campaign not found: " + batch.campaignId()));

        for (EmailContactInfo contact : batch.contacts()) {
            try {
                processContact(campaign, contact, batch.workspaceId());
            } catch (RateLimitExceededException e) {
                // Re-throw so @RetryableTopic retries the whole batch after backoff.
                // Contacts already SENT will be skipped on retry (idempotency check below).
                throw e;
            } catch (Exception e) {
                log.error("Send failed: campaign={} contact={} error={}",
                        batch.campaignId(), contact.contactId(), e.getMessage());
                silentlyUpdateStatus(batch.campaignId(), contact.contactId(), CampaignContactStatus.FAILED);
            }
        }
    }

    private void processContact(Campaign campaign, EmailContactInfo contact, UUID workspaceId) {
        UUID campaignId = campaign.getId();
        UUID contactId = contact.contactId();

        // 1. Idempotency check — skip if already processed in a previous attempt
        CampaignContact cc = campaignContactRepository
                .findById(new CampaignContactId(campaignId, contactId))
                .orElse(null);
        if (cc == null || cc.getStatus() != CampaignContactStatus.PENDING) {
            log.debug("Skipping contact={} status={}", contactId, cc == null ? "missing" : cc.getStatus());
            return;
        }

        // 2. Rate limit — throw to trigger @RetryableTopic backoff if exhausted
        if (!rateLimiterService.tryConsume(workspaceId, 1)) {
            throw new RateLimitExceededException("Rate limit exhausted for workspace=" + workspaceId);
        }

        // 3. Build template variables from contact fields
        Map<String, String> vars = buildVars(contact, campaign);

        // 4. Create tracking tokens (deterministic — safe on retry, ON CONFLICT DO NOTHING)
        UUID openTokenId = deterministicToken(campaignId, contactId, "OPEN");
        trackingTokenRepository.insertIfAbsent(openTokenId, campaignId, contactId, workspaceId, "OPEN", null);

        // 5. Render HTML — linkTransformer creates a CLICK token per unique URL
        String renderedHtml = templateRenderer.renderForSend(
                campaign.getTemplate().getHtmlContent(),
                vars,
                originalUrl -> {
                    UUID clickTokenId = deterministicToken(campaignId, contactId, originalUrl);
                    trackingTokenRepository.insertIfAbsent(
                            clickTokenId, campaignId, contactId, workspaceId, "CLICK", originalUrl);
                    return appProperties.getBaseUrl() + "/t/c/" + clickTokenId;
                },
                appProperties.getBaseUrl() + "/t/o/" + openTokenId
        );

        // 6. Send via whichever provider is active (Resend or SES — swapped by env var, no code change)
        emailProvider.send(new EmailMessage(
                contact.email(),
                contact.firstName(),
                campaign.getFromEmail(),
                campaign.getFromName(),
                campaign.getTemplate().getSubject(),
                renderedHtml,
                campaignId + "::" + contactId  // idempotency key for provider-level dedup
        ));

        // 7. Mark sent + publish tracking event
        campaignContactRepository.updateStatus(campaignId, contactId, CampaignContactStatus.SENT);
        publishTrackingEvent(campaignId, contactId, workspaceId, "SENT");

        log.debug("Sent: campaign={} contact={} email={}", campaignId, contactId, contact.email());
    }

    @DltHandler
    public void onDeadLetter(String payload, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        log.error("Email batch permanently failed after all retries. topic={} payload={}", topic, payload);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    /**
     * Produces the same UUID for the same (campaign, contact, discriminator) triple every time.
     * Guarantees token rows are identical on consumer retry → ON CONFLICT DO NOTHING is the guard.
     */
    private UUID deterministicToken(UUID campaignId, UUID contactId, String discriminator) {
        String seed = campaignId + "::" + contactId + "::" + discriminator;
        return UUID.nameUUIDFromBytes(seed.getBytes(StandardCharsets.UTF_8));
    }

    private Map<String, String> buildVars(EmailContactInfo contact, Campaign campaign) {
        Map<String, String> vars = new HashMap<>();
        // Template-level defaults first, contact fields override
        if (campaign.getTemplate().getVariables() != null) {
            campaign.getTemplate().getVariables().forEach((k, v) -> vars.put(k, String.valueOf(v)));
        }
        if (contact.firstName() != null) vars.put("firstName", contact.firstName());
        if (contact.lastName() != null)  vars.put("lastName", contact.lastName());
        vars.put("email", contact.email());
        return vars;
    }

    private void publishTrackingEvent(UUID campaignId, UUID contactId, UUID workspaceId, String eventType) {
        try {
            String msg = objectMapper.writeValueAsString(
                    new TrackingEventMessage(campaignId, contactId, workspaceId, eventType, Instant.now()));
            kafkaTemplate.send(KafkaTopics.TRACKING_EVENTS, campaignId.toString(), msg);
        } catch (JsonProcessingException e) {
            log.error("Failed to publish tracking event campaign={} type={}: {}", campaignId, eventType, e.getMessage());
        }
    }

    private void silentlyUpdateStatus(UUID campaignId, UUID contactId, CampaignContactStatus status) {
        try {
            campaignContactRepository.updateStatus(campaignId, contactId, status);
        } catch (Exception ex) {
            log.error("Could not update contact status campaign={} contact={}: {}", campaignId, contactId, ex.getMessage());
        }
    }
}
