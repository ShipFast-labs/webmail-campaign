package com.example.emailcampaign.analytics.dto;

public record DashboardKpiResponse(
        long totalSent,
        double openRate,
        double clickRate,
        double bounceRate,
        double sentTrend,
        double openRateTrend,
        double clickRateTrend,
        double bounceRateTrend
) {}
