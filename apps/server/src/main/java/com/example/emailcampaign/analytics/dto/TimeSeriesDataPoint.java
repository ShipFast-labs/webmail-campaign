package com.example.emailcampaign.analytics.dto;

public record TimeSeriesDataPoint(
        String date,
        long opens,
        long clicks,
        long sends
) {}
