package com.example.emailcampaign.campaign.repository;

import com.example.emailcampaign.campaign.domain.CampaignContact;
import com.example.emailcampaign.campaign.domain.CampaignContactId;
import com.example.emailcampaign.campaign.domain.CampaignContactStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface CampaignContactRepository extends JpaRepository<CampaignContact, CampaignContactId> {

    long countById_CampaignId(UUID campaignId);

    long countById_CampaignIdAndStatus(UUID campaignId, CampaignContactStatus status);

    @Modifying
    @Query(value = """
            INSERT INTO campaign_contacts (campaign_id, contact_id, idempotency_key, status, created_at, updated_at)
            VALUES (:campaignId, :contactId, :idempotencyKey, 'PENDING', NOW(), NOW())
            ON CONFLICT (idempotency_key) DO NOTHING
            """, nativeQuery = true)
    void insertIfAbsent(
            @Param("campaignId") UUID campaignId,
            @Param("contactId") UUID contactId,
            @Param("idempotencyKey") String idempotencyKey
    );
}
