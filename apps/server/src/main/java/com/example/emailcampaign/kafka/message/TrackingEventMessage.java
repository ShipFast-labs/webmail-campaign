package com.example.emailcampaign.kafka.message;

import java.time.Instant;
import java.util.UUID;

public record TrackingEventMessage(
        UUID campaignId,
        UUID contactId,
        UUID workspaceId,
        String eventType,
        Instant occurredAt
) {}
