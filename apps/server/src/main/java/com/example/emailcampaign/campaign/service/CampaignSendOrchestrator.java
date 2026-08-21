package com.example.emailcampaign.campaign.service;

import com.example.emailcampaign.billing.service.CreditService;
import com.example.emailcampaign.campaign.domain.Campaign;
import com.example.emailcampaign.campaign.domain.CampaignStateMachine;
import com.example.emailcampaign.campaign.domain.CampaignStatus;
import com.example.emailcampaign.campaign.repository.CampaignRepository;
import com.example.emailcampaign.kafka.KafkaTopics;
import com.example.emailcampaign.kafka.message.CampaignScheduledMessage;
import com.example.emailcampaign.list.repository.ListContactRepository;
import com.example.emailcampaign.outbox.domain.OutboxEvent;
import com.example.emailcampaign.outbox.repository.OutboxEventRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CampaignSendOrchestrator {

    private final CampaignRepository campaignRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;
    private final ListContactRepository listContactRepository;
    private final CreditService creditService;

    @Transactional
    public void initiateSend(Campaign campaign, UUID workspaceId) {
        long recipientCount = listContactRepository.countById_ListId(campaign.getTargetList().getId());
        creditService.deductCredits(workspaceId, recipientCount);

        CampaignStateMachine.transition(campaign, CampaignStatus.SENDING);
        campaign.setScheduledAt(null);
        campaignRepository.save(campaign);

        try {
            String payload = objectMapper.writeValueAsString(
                    new CampaignScheduledMessage(campaign.getId(), workspaceId)
            );
            outboxEventRepository.save(
                    OutboxEvent.builder()
                            .aggregateType("CAMPAIGN")
                            .aggregateId(campaign.getId())
                            .eventType("CAMPAIGN_SEND_REQUESTED")
                            .payload(payload)
                            .topic(KafkaTopics.CAMPAIGN_SCHEDULED)
                            .build()
            );
            log.info("Queued send for campaign={} workspace={}", campaign.getId(), workspaceId);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize campaign scheduled message for campaign: " + campaign.getId(), e);
        }
    }
}
