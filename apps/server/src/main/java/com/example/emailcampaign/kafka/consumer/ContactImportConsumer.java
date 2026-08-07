package com.example.emailcampaign.kafka.consumer;

import com.example.emailcampaign.contact.service.ContactImportService;
import com.example.emailcampaign.kafka.message.ImportJobMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.BackOff;
import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.retrytopic.TopicSuffixingStrategy;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ContactImportConsumer {

    private final ContactImportService contactImportService;
    private final ObjectMapper objectMapper;

    @RetryableTopic(
            attempts = "3",
            backOff = @BackOff(delay = 10_000, multiplier = 3),
            topicSuffixingStrategy = TopicSuffixingStrategy.SUFFIX_WITH_INDEX_VALUE,
            dltTopicSuffix = "-dlt",
            exclude = { JsonProcessingException.class }
    )
    @KafkaListener(
            topics = "contact.import.jobs",
            groupId = "contact-import-group"
    )
    public void consume(String payload) {
        try {
            ImportJobMessage message = objectMapper.readValue(payload, ImportJobMessage.class);
            log.info("Processing import job: {}", message.jobId());
            contactImportService.processImport(message.workspaceId(), message.jobId());
        } catch (JsonProcessingException e) {
            
            log.error("Invalid import job message, discarding: {}", payload, e);
        }
    }

    @DltHandler
    public void onDeadLetter(String payload, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        log.error("Import job permanently failed after all retries. Topic: {}, Payload: {}", topic, payload);
        try {
            ImportJobMessage message = objectMapper.readValue(payload, ImportJobMessage.class);
            contactImportService.markJobFailed(message.jobId(), "Permanently failed after all retry attempts");
        } catch (JsonProcessingException e) {
            log.error("Could not parse DLT payload to mark job as failed: {}", payload, e);
        }
    }
}
