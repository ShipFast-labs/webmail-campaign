package com.example.emailcampaign.tracking.controller;

import com.example.emailcampaign.kafka.KafkaTopics;
import com.example.emailcampaign.kafka.message.TrackingEventMessage;
import com.example.emailcampaign.tracking.domain.TrackingToken;
import com.example.emailcampaign.tracking.repository.TrackingTokenRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/t")
@RequiredArgsConstructor
public class TrackingController {

    private static final byte[] TRANSPARENT_GIF = Base64.getDecoder().decode(
            "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    );

    private final TrackingTokenRepository trackingTokenRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @GetMapping("/o/{token}")
    public ResponseEntity<byte[]> trackOpen(@PathVariable UUID token) {
        trackingTokenRepository.findById(token).ifPresentOrElse(
                t -> publishEvent(t, "OPENED"),
                () -> log.warn("Open pixel hit with unknown token={}", token)
        );

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("image/gif"))
                .header(HttpHeaders.CACHE_CONTROL, "no-store, no-cache, must-revalidate")
                .header(HttpHeaders.PRAGMA, "no-cache")
                .body(TRANSPARENT_GIF);
    }

    @GetMapping("/c/{token}")
    public ResponseEntity<Void> trackClick(@PathVariable UUID token) {
        TrackingToken tt = trackingTokenRepository.findById(token).orElse(null);

        if (tt == null) {
            log.warn("Click redirect hit with unknown token={}", token);
            return ResponseEntity.notFound().build();
        }

        trackingTokenRepository.markConsumed(token);
        publishEvent(tt, "CLICKED");

        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, tt.getOriginalUrl())
                .build();
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
            log.debug("Tracking event: type={} campaign={} contact={}",
                    eventType, token.getCampaignId(), token.getContactId());
        } catch (JsonProcessingException e) {
            log.error("Failed to publish {} event for token={}: {}", eventType, token.getToken(), e.getMessage());
        }
    }
}
