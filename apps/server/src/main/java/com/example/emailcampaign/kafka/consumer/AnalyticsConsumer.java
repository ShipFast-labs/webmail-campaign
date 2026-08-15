package com.example.emailcampaign.kafka.consumer;

import com.example.emailcampaign.kafka.KafkaTopics;
import com.example.emailcampaign.kafka.message.TrackingEventMessage;
import com.example.emailcampaign.tracking.domain.TrackingEvent;
import com.example.emailcampaign.tracking.repository.TrackingEventRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AnalyticsConsumer {

    private final TrackingEventRepository trackingEventRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopics.TRACKING_EVENTS, groupId = "analytics-aggregator")
    public void consume(String payload) {
        try {
            TrackingEventMessage msg = objectMapper.readValue(payload, TrackingEventMessage.class);

            trackingEventRepository.save(TrackingEvent.builder()
                    .workspaceId(msg.workspaceId())
                    .campaignId(msg.campaignId())
                    .contactId(msg.contactId())
                    .eventType(msg.eventType())
                    .occurredAt(msg.occurredAt())
                    .build());

            log.debug("Analytics recorded: type={} campaign={} contact={}",
                    msg.eventType(), msg.campaignId(), msg.contactId());

        } catch (JsonProcessingException e) {
            log.error("Failed to parse tracking event: {} error={}", payload, e.getMessage());
        }
    }
}
