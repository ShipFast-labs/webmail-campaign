package com.example.emailcampaign.tracking.service;

import com.example.emailcampaign.campaign.repository.CampaignContactRepository;
import com.example.emailcampaign.contact.repository.ContactRepository;
import com.example.emailcampaign.kafka.KafkaTopics;
import com.example.emailcampaign.kafka.message.TrackingEventMessage;
import com.example.emailcampaign.tracking.domain.TrackingToken;
import com.example.emailcampaign.tracking.repository.TrackingTokenRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrackingService {

    private static final List<String> BOT_UA_PATTERNS = List.of(
            "GoogleImageProxy",
            "Apple-Mail-Proxy",
            "YahooMailProxy",
            "Outlook-iOS",
            "MailChimp",
            "Googlebot",
            "bingbot",
            "facebookexternalhit"
    );

    private final TrackingTokenRepository trackingTokenRepository;
    private final ContactRepository contactRepository;
    private final CampaignContactRepository campaignContactRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void recordOpen(UUID token, String userAgent) {
        if (isBot(userAgent)) {
            log.debug("Skipping open — bot/proxy UA: {}", userAgent);
            return;
        }
        trackingTokenRepository.findById(token).ifPresentOrElse(
                t -> publishEvent(t, "OPENED"),
                () -> log.warn("Open pixel hit with unknown token={}", token)
        );
    }

    @Transactional
    public void recordUnsubscribe(UUID token) {
        trackingTokenRepository.findById(token).ifPresentOrElse(tt -> {
            contactRepository.markUnsubscribed(tt.getContactId());
            campaignContactRepository.updateStatusIfNotTerminal(tt.getCampaignId(), tt.getContactId(), "UNSUBSCRIBED");
            publishEvent(tt, "UNSUBSCRIBED");
            log.info("Unsubscribed: contact={} campaign={}", tt.getContactId(), tt.getCampaignId());
        }, () -> log.warn("Unsubscribe hit with unknown token={}", token));
    }

    public Optional<String> recordClickAndGetRedirectUrl(UUID token) {
        TrackingToken tt = trackingTokenRepository.findById(token).orElse(null);
        if (tt == null) {
            log.warn("Click redirect hit with unknown token={}", token);
            return Optional.empty();
        }
        trackingTokenRepository.markConsumed(token);
        publishEvent(tt, "CLICKED");
        return Optional.of(tt.getOriginalUrl());
    }

    private boolean isBot(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) return false;
        String ua = userAgent.toLowerCase();
        return BOT_UA_PATTERNS.stream().anyMatch(pattern -> ua.contains(pattern.toLowerCase()));
    }

    private void publishEvent(TrackingToken token, String eventType) {
        try {
            String payload = objectMapper.writeValueAsString(new TrackingEventMessage(
                    token.getCampaignId(),
                    token.getContactId(),
                    token.getWorkspaceId(),
                    eventType,
                    Instant.now()
            ));
            kafkaTemplate.send(KafkaTopics.TRACKING_EVENTS, token.getCampaignId().toString(), payload);
            log.debug("Tracking event published: type={} campaign={} contact={}",
                    eventType, token.getCampaignId(), token.getContactId());
        } catch (JsonProcessingException e) {
            log.error("Failed to publish {} event for token={}: {}", eventType, token.getToken(), e.getMessage());
        }
    }
}
