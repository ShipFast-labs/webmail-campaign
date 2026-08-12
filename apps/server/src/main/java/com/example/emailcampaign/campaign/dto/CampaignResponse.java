package com.example.emailcampaign.campaign.dto;

import com.example.emailcampaign.campaign.domain.CampaignStatus;

import java.time.Instant;
import java.util.UUID;

public record CampaignResponse(
        UUID id,
        UUID workspaceId,
        String name,
        String subject,
        String fromName,
        String fromEmail,
        CampaignStatus status,
        UUID templateId,
        UUID targetListId,
        Instant scheduledAt,
        Instant createdAt,
        Instant updatedAt
) {}
