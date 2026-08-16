package com.example.emailcampaign.analytics.service;

import com.example.emailcampaign.analytics.dto.CampaignAnalyticsResponse;
import com.example.emailcampaign.analytics.dto.DashboardKpiResponse;
import com.example.emailcampaign.analytics.dto.TimeSeriesDataPoint;
import com.example.emailcampaign.campaign.domain.CampaignContactStatus;
import com.example.emailcampaign.campaign.repository.CampaignContactRepository;
import com.example.emailcampaign.tracking.repository.TrackingEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final TrackingEventRepository trackingEventRepository;
    private final CampaignContactRepository campaignContactRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardKpiResponse getDashboardKpi(UUID workspaceId) {
        long totalSent    = trackingEventRepository.countSentByWorkspaceLast30Days(workspaceId);
        long uniqueOpens  = trackingEventRepository.countUniqueOpensByWorkspaceLast30Days(workspaceId);
        long uniqueClicks = trackingEventRepository.countUniqueClicksByWorkspaceLast30Days(workspaceId);
        long bounced      = trackingEventRepository.countBouncedByWorkspaceLast30Days(workspaceId);

        double openRate   = totalSent > 0 ? (double) uniqueOpens  / totalSent : 0;
        double clickRate  = totalSent > 0 ? (double) uniqueClicks / totalSent : 0;
        double bounceRate = totalSent > 0 ? (double) bounced      / totalSent : 0;

        return new DashboardKpiResponse(totalSent, openRate, clickRate, bounceRate, 0, 0, 0, 0);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimeSeriesDataPoint> getDashboardTimeSeries(UUID workspaceId) {
        return toPoints(trackingEventRepository.findDashboardTimeSeries(workspaceId));
    }

    @Override
    @Transactional(readOnly = true)
    public CampaignAnalyticsResponse getCampaignAnalytics(UUID campaignId) {
        long totalSent         = campaignContactRepository.countById_CampaignIdAndStatusNot(campaignId, CampaignContactStatus.PENDING);
        long totalDelivered    = campaignContactRepository.countById_CampaignIdAndStatus(campaignId, CampaignContactStatus.DELIVERED);
        long totalOpened       = trackingEventRepository.countDistinctContactsByCampaignIdAndEventType(campaignId, "OPENED");
        long totalClicked      = trackingEventRepository.countDistinctContactsByCampaignIdAndEventType(campaignId, "CLICKED");
        long totalBounced      = campaignContactRepository.countById_CampaignIdAndStatus(campaignId, CampaignContactStatus.BOUNCED);
        long totalUnsubscribed = campaignContactRepository.countById_CampaignIdAndStatus(campaignId, CampaignContactStatus.UNSUBSCRIBED);

        return new CampaignAnalyticsResponse(
                campaignId, totalSent, totalDelivered,
                totalOpened, totalClicked, totalBounced, totalUnsubscribed
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimeSeriesDataPoint> getCampaignTimeSeries(UUID campaignId) {
        return toPoints(trackingEventRepository.findCampaignTimeSeries(campaignId));
    }

    private List<TimeSeriesDataPoint> toPoints(List<Object[]> rows) {
        return rows.stream()
                .map(row -> new TimeSeriesDataPoint(
                        row[0].toString(),
                        ((Number) row[1]).longValue(),
                        ((Number) row[2]).longValue(),
                        ((Number) row[3]).longValue()
                ))
                .toList();
    }
}
