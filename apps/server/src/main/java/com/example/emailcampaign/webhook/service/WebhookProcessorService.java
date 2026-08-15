package com.example.emailcampaign.webhook.service;

import com.example.emailcampaign.campaign.repository.CampaignContactRepository;
import com.example.emailcampaign.config.AppProperties;
import com.example.emailcampaign.kafka.KafkaTopics;
import com.example.emailcampaign.kafka.message.ContactEventMessage;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookProcessorService {

    private final CampaignContactRepository campaignContactRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final AppProperties appProperties;

    public boolean isValidResendSignature(String svixId, String svixTimestamp,
                                          String svixSignature, String rawBody) {
        String secret = appProperties.getWebhook().getResendSigningSecret();
        if (secret == null || secret.isBlank()) {
            log.warn("Resend webhook signing secret not configured — skipping validation");
            return true;
        }

        try {
            String signedContent = svixId + "." + svixTimestamp + "." + rawBody;

            byte[] secretBytes = Base64.getDecoder().decode(
                    secret.replaceFirst("^whsec_", "")
            );

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secretBytes, "HmacSHA256"));
            String computed = "v1," + Base64.getEncoder().encodeToString(
                    mac.doFinal(signedContent.getBytes())
            );

            for (String sig : svixSignature.split(" ")) {
                if (sig.equals(computed)) return true;
            }

            log.warn("Resend webhook signature mismatch");
            return false;

        } catch (Exception e) {
            log.error("Signature validation failed: {}", e.getMessage());
            return false;
        }
    }

    public void processResendEvent(String rawBody) {
        try {
            JsonNode root = objectMapper.readTree(rawBody);
            String eventType = root.path("type").asText();
            JsonNode data = root.path("data");

            String emailId = data.path("email_id").asText(null);
            String refId   = extractRefId(data);

            if (refId == null) {
                log.warn("Resend webhook missing X-Entity-Ref-Id, skipping. emailId={}", emailId);
                return;
            }

            String[] parts = refId.split("::");
            if (parts.length != 2) {
                log.warn("Invalid X-Entity-Ref-Id format: {}", refId);
                return;
            }

            UUID campaignId = UUID.fromString(parts[0]);
            UUID contactId  = UUID.fromString(parts[1]);

            switch (eventType) {
                case "email.delivered" -> handleDelivered(campaignId, contactId, emailId);
                case "email.bounced"   -> handleBounced(campaignId, contactId, emailId);
                case "email.complained" -> handleComplained(campaignId, contactId, emailId);
                default -> log.debug("Unhandled Resend event type: {}", eventType);
            }

        } catch (Exception e) {
            log.error("Failed to process Resend webhook: {}", e.getMessage(), e);
        }
    }

    private void handleDelivered(UUID campaignId, UUID contactId, String emailId) {
        campaignContactRepository.updateStatusIfNotTerminal(campaignId, contactId, "DELIVERED");
        log.debug("Delivered: campaign={} contact={}", campaignId, contactId);
    }

    private void handleBounced(UUID campaignId, UUID contactId, String emailId) {
        campaignContactRepository.updateStatusIfNotTerminal(campaignId, contactId, "BOUNCED");
        publishContactEvent(contactId, "BOUNCED");
        log.debug("Bounced: campaign={} contact={}", campaignId, contactId);
    }

    private void handleComplained(UUID campaignId, UUID contactId, String emailId) {
        campaignContactRepository.updateStatusIfNotTerminal(campaignId, contactId, "BOUNCED");
        publishContactEvent(contactId, "UNSUBSCRIBED");
        log.debug("Complained (spam): campaign={} contact={}", campaignId, contactId);
    }

    private void publishContactEvent(UUID contactId, String eventType) {
        try {
            String payload = objectMapper.writeValueAsString(
                    new ContactEventMessage(null, contactId, eventType)
            );
            kafkaTemplate.send(KafkaTopics.CONTACT_EVENTS, contactId.toString(), payload);
        } catch (Exception e) {
            log.error("Failed to publish contact event: {}", e.getMessage());
        }
    }

    private String extractRefId(JsonNode data) {
        JsonNode headers = data.path("headers");
        if (headers.isArray()) {
            for (JsonNode h : headers) {
                if ("X-Entity-Ref-Id".equalsIgnoreCase(h.path("name").asText())) {
                    return h.path("value").asText(null);
                }
            }
        }
        return null;
    }
}
