package com.example.emailcampaign.kafka.consumer;

import com.example.emailcampaign.contact.domain.Status;
import com.example.emailcampaign.contact.repository.ContactRepository;
import com.example.emailcampaign.kafka.KafkaTopics;
import com.example.emailcampaign.kafka.message.ContactEventMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ContactEventConsumer {

    private final ContactRepository contactRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaTopics.CONTACT_EVENTS, groupId = "contact-status-updater")
    public void consume(String payload) {
        try {
            ContactEventMessage msg = objectMapper.readValue(payload, ContactEventMessage.class);

            Status newStatus = switch (msg.eventType()) {
                case "BOUNCED"       -> Status.BOUNCED;
                case "UNSUBSCRIBED"  -> Status.UNSUBSCRIBED;
                default -> {
                    log.warn("Unknown contact event type: {}", msg.eventType());
                    yield null;
                }
            };

            if (newStatus != null) {
                contactRepository.updateStatusIfActive(msg.contactId(), newStatus);
                log.debug("Contact status updated: contact={} status={}", msg.contactId(), newStatus);
            }

        } catch (JsonProcessingException e) {
            log.error("Failed to parse contact event: {}", e.getMessage());
        }
    }
}
