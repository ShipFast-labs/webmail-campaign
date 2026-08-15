package com.example.emailcampaign.analytics.service;

import com.example.emailcampaign.analytics.dto.CampaignAnalyticsResponse;
import com.example.emailcampaign.analytics.dto.DashboardKpiResponse;
import com.example.emailcampaign.analytics.dto.TimeSeriesDataPoint;

import java.util.List;
import java.util.UUID;

public interface AnalyticsService {

    DashboardKpiResponse getDashboardKpi(UUID workspaceId);

    List<TimeSeriesDataPoint> getDashboardTimeSeries(UUID workspaceId);

    CampaignAnalyticsResponse getCampaignAnalytics(UUID campaignId);

    List<TimeSeriesDataPoint> getCampaignTimeSeries(UUID campaignId);
}
