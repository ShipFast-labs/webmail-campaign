package com.example.emailcampaign.kafka.producer;

import com.example.emailcampaign.kafka.message.ImportJobMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class ContactImportProducer {

    private static final String TOPIC = "contact.import.jobs";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void publish(UUID workspaceId, UUID jobId) {
        try {
            ImportJobMessage message = new ImportJobMessage(workspaceId, jobId);
            String payload = objectMapper.writeValueAsString(message);
           
            kafkaTemplate.send(TOPIC, workspaceId.toString(), payload);
            log.info("Published import job {} to topic {}", jobId, TOPIC);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize import job message for jobId: " + jobId, e);
        }
    }
}
