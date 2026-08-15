package com.example.emailcampaign.tracking.repository;

import com.example.emailcampaign.tracking.domain.TrackingToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Repository
public interface TrackingTokenRepository extends JpaRepository<TrackingToken, UUID> {

    @Transactional
    @Modifying
    @Query(value = """
            INSERT INTO tracking_tokens (token, campaign_id, contact_id, workspace_id, token_type, original_url, consumed, created_at)
            VALUES (:token, :campaignId, :contactId, :workspaceId, :tokenType, :originalUrl, false, NOW())
            ON CONFLICT (token) DO NOTHING
            """, nativeQuery = true)
    void insertIfAbsent(
            @Param("token") UUID token,
            @Param("campaignId") UUID campaignId,
            @Param("contactId") UUID contactId,
            @Param("workspaceId") UUID workspaceId,
            @Param("tokenType") String tokenType,
            @Param("originalUrl") String originalUrl
    );

    @Transactional
    @Modifying
    @Query("UPDATE TrackingToken t SET t.consumed = true WHERE t.token = :token AND t.consumed = false")
    void markConsumed(@Param("token") UUID token);
}
