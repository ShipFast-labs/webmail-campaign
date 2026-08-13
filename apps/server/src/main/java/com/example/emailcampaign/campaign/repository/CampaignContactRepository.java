package com.example.emailcampaign.campaign.repository;

import com.example.emailcampaign.campaign.domain.CampaignContact;
import com.example.emailcampaign.campaign.domain.CampaignContactId;
import com.example.emailcampaign.campaign.domain.CampaignContactStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

public interface CampaignContactRepository extends JpaRepository<CampaignContact, CampaignContactId> {

    @Query(value = "SELECT cc FROM CampaignContact cc JOIN FETCH cc.contact WHERE cc.id.campaignId = :campaignId",
           countQuery = "SELECT COUNT(cc) FROM CampaignContact cc WHERE cc.id.campaignId = :campaignId")
    Page<CampaignContact> findByCampaignIdWithContact(@Param("campaignId") UUID campaignId, Pageable pageable);

    long countById_CampaignId(UUID campaignId);

    long countById_CampaignIdAndStatus(UUID campaignId, CampaignContactStatus status);

    @Transactional
    @Modifying
    @Query("UPDATE CampaignContact c SET c.status = :status WHERE c.id.campaignId = :campaignId AND c.id.contactId = :contactId")
    void updateStatus(
            @Param("campaignId") UUID campaignId,
            @Param("contactId") UUID contactId,
            @Param("status") CampaignContactStatus status
    );

    @Transactional
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
