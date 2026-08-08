package com.example.emailcampaign.list.dto;

import java.time.Instant;
import java.util.UUID;

public record AudienceListResponse(
        UUID id,
        UUID workspaceId,
        String name,
        int contactCount,
        Instant createdAt,
        Instant updatedAt
) {}
