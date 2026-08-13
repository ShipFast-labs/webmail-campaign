package com.example.emailcampaign.campaign.dto;

import java.time.Instant;
import java.util.UUID;

public record CampaignContactResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        String status,
        Instant updatedAt
) {}
