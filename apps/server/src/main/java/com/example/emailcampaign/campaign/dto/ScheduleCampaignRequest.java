package com.example.emailcampaign.campaign.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record ScheduleCampaignRequest(
        @NotNull(message = "Scheduled date is required")
        @Future(message = "Scheduled date must be in the future") Instant scheduledAt
) {}
