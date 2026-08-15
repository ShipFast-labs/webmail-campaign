package com.example.emailcampaign.analytics.dto;

import java.util.UUID;

public record CampaignAnalyticsResponse(
        UUID campaignId,
        long totalSent,
        long totalDelivered,
        long totalOpened,
        long totalClicked,
        long totalBounced,
        long totalUnsubscribed
) {}
