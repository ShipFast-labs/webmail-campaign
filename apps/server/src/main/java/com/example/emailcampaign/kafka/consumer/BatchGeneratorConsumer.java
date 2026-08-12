package com.example.emailcampaign.kafka.consumer;

import com.example.emailcampaign.campaign.repository.CampaignContactRepository;
import com.example.emailcampaign.campaign.repository.CampaignRepository;
import com.example.emailcampaign.common.exception.ApiException;
import com.example.emailcampaign.kafka.KafkaTopics;
import com.example.emailcampaign.kafka.message.CampaignScheduledMessage;
import com.example.emailcampaign.kafka.message.EmailContactInfo;
import com.example.emailcampaign.kafka.message.EmailSendBatchMessage;
import com.example.emailcampaign.list.domain.ListContact;
import com.example.emailcampaign.list.repository.ListContactRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.kafka.annotation.BackOff;
import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.retrytopic.TopicSuffixingStrategy;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class BatchGeneratorConsumer {

    private static final int CONTACT_PAGE_SIZE = 250;

    private final CampaignRepository campaignRepository;
    private final ListContactRepository listContactRepository;
    private final CampaignContactRepository campaignContactRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @RetryableTopic(
            attempts = "3",
            backOff = @BackOff(delay = 5_000, multiplier = 2),
            topicSuffixingStrategy = TopicSuffixingStrategy.SUFFIX_WITH_INDEX_VALUE,
            dltTopicSuffix = "-dlt",
            exclude = {JsonProcessingException.class}
    )
    @KafkaListener(topics = KafkaTopics.CAMPAIGN_SCHEDULED, groupId = "campaign-batch-generator")
    public void consume(String payload) throws JsonProcessingException {
        CampaignScheduledMessage msg = objectMapper.readValue(payload, CampaignScheduledMessage.class);
        UUID campaignId = msg.campaignId();
        UUID workspaceId = msg.workspaceId();

        var campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> ApiException.notFound("CAMPAIGN_NOT_FOUND", "Campaign not found: " + campaignId));

        UUID listId = campaign.getTargetList().getId();
        int pageNum = 0;
        int totalBatches = 0;
        Page<ListContact> page;

        do {
            page = listContactRepository.findByListIdWithContact(
                    listId, PageRequest.of(pageNum++, CONTACT_PAGE_SIZE)
            );

            if (page.isEmpty()) break;

            List<ListContact> contacts = page.getContent();

            insertCampaignContacts(campaignId, contacts);
            publishBatch(campaignId, workspaceId, contacts);
            totalBatches++;

        } while (page.hasNext());

        log.info("Batch generation done: campaign={} batches={} contacts={}",
                campaignId, totalBatches, totalBatches * CONTACT_PAGE_SIZE);
    }

    private void insertCampaignContacts(UUID campaignId, List<ListContact> contacts) {
        for (ListContact lc : contacts) {
            UUID contactId = lc.getContact().getId();
            String idempotencyKey = campaignId + "::" + contactId;
            campaignContactRepository.insertIfAbsent(campaignId, contactId, idempotencyKey);
        }
    }

    private void publishBatch(UUID campaignId, UUID workspaceId, List<ListContact> contacts)
            throws JsonProcessingException {
        List<EmailContactInfo> emailContacts = contacts.stream()
                .map(lc -> new EmailContactInfo(
                        lc.getContact().getId(),
                        lc.getContact().getEmail(),
                        lc.getContact().getFirstName(),
                        lc.getContact().getLastName()
                ))
                .toList();

        String batchPayload = objectMapper.writeValueAsString(
                new EmailSendBatchMessage(campaignId, workspaceId, emailContacts)
        );

        kafkaTemplate.send(KafkaTopics.EMAIL_SEND_BATCHES, workspaceId.toString(), batchPayload);
    }

    @DltHandler
    public void onDeadLetter(String payload, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        log.error("Batch generation permanently failed. Topic={} Payload={}", topic, payload);
    }
}
