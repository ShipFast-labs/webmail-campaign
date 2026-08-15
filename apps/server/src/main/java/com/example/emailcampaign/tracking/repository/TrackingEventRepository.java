package com.example.emailcampaign.tracking.repository;

import com.example.emailcampaign.tracking.domain.TrackingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface TrackingEventRepository extends JpaRepository<TrackingEvent, UUID> {

    long countByCampaignIdAndEventType(UUID campaignId, String eventType);

    @Query("SELECT COUNT(DISTINCT t.contactId) FROM TrackingEvent t WHERE t.campaignId = :campaignId AND t.eventType = :eventType")
    long countDistinctContactsByCampaignIdAndEventType(@Param("campaignId") UUID campaignId, @Param("eventType") String eventType);

    @Query(value = """
            SELECT DATE(DATE_TRUNC('day', occurred_at)) AS date,
                   COALESCE(SUM(CASE WHEN event_type = 'OPENED'  THEN 1 ELSE 0 END), 0) AS opens,
                   COALESCE(SUM(CASE WHEN event_type = 'CLICKED' THEN 1 ELSE 0 END), 0) AS clicks,
                   COALESCE(SUM(CASE WHEN event_type = 'SENT'    THEN 1 ELSE 0 END), 0) AS sends
            FROM tracking_events
            WHERE campaign_id = :campaignId
            GROUP BY 1
            ORDER BY 1
            """, nativeQuery = true)
    List<Object[]> findCampaignTimeSeries(@Param("campaignId") UUID campaignId);

    @Query(value = "SELECT COUNT(*) FROM tracking_events WHERE workspace_id = :workspaceId AND event_type = 'SENT' AND occurred_at >= NOW() - INTERVAL '30 days'",
            nativeQuery = true)
    long countSentByWorkspaceLast30Days(@Param("workspaceId") UUID workspaceId);

    @Query(value = "SELECT COUNT(DISTINCT contact_id) FROM tracking_events WHERE workspace_id = :workspaceId AND event_type = 'OPENED' AND occurred_at >= NOW() - INTERVAL '30 days'",
            nativeQuery = true)
    long countUniqueOpensByWorkspaceLast30Days(@Param("workspaceId") UUID workspaceId);

    @Query(value = "SELECT COUNT(DISTINCT contact_id) FROM tracking_events WHERE workspace_id = :workspaceId AND event_type = 'CLICKED' AND occurred_at >= NOW() - INTERVAL '30 days'",
            nativeQuery = true)
    long countUniqueClicksByWorkspaceLast30Days(@Param("workspaceId") UUID workspaceId);

    @Query(value = "SELECT COUNT(DISTINCT contact_id) FROM tracking_events WHERE workspace_id = :workspaceId AND event_type = 'BOUNCED' AND occurred_at >= NOW() - INTERVAL '30 days'",
            nativeQuery = true)
    long countBouncedByWorkspaceLast30Days(@Param("workspaceId") UUID workspaceId);

    @Query(value = """
            SELECT DATE(DATE_TRUNC('day', occurred_at)) AS date,
                   COALESCE(SUM(CASE WHEN event_type = 'OPENED'  THEN 1 ELSE 0 END), 0) AS opens,
                   COALESCE(SUM(CASE WHEN event_type = 'CLICKED' THEN 1 ELSE 0 END), 0) AS clicks,
                   COALESCE(SUM(CASE WHEN event_type = 'SENT'    THEN 1 ELSE 0 END), 0) AS sends
            FROM tracking_events
            WHERE workspace_id = :workspaceId
              AND occurred_at >= NOW() - INTERVAL '30 days'
            GROUP BY 1
            ORDER BY 1
            """, nativeQuery = true)
    List<Object[]> findDashboardTimeSeries(@Param("workspaceId") UUID workspaceId);

    @Transactional
    @Modifying
    @Query(value = """
            INSERT INTO tracking_events (id, workspace_id, campaign_id, contact_id, event_type, provider_event_id, occurred_at, created_at)
            VALUES (gen_random_uuid(), :workspaceId, :campaignId, :contactId, :eventType, :providerEventId, :occurredAt, NOW())
            ON CONFLICT (campaign_id, contact_id, event_type, provider_event_id) DO NOTHING
            """, nativeQuery = true)
    int insertWebhookEvent(
            @Param("workspaceId") UUID workspaceId,
            @Param("campaignId") UUID campaignId,
            @Param("contactId") UUID contactId,
            @Param("eventType") String eventType,
            @Param("providerEventId") String providerEventId,
            @Param("occurredAt") Instant occurredAt
    );
}
