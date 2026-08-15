package com.example.emailcampaign.analytics.controller;

import com.example.emailcampaign.analytics.dto.DashboardKpiResponse;
import com.example.emailcampaign.analytics.dto.TimeSeriesDataPoint;
import com.example.emailcampaign.analytics.service.AnalyticsService;
import com.example.emailcampaign.common.api.ApiResponse;
import com.example.emailcampaign.common.context.WorkspaceContext;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Analytics", description = "Workspace-level dashboard analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardKpiResponse>> getDashboardKpi() {
        return ResponseEntity.ok(ApiResponse.ok(
                analyticsService.getDashboardKpi(WorkspaceContext.getCurrentWorkspaceId())
        ));
    }

    @GetMapping("/dashboard/timeseries")
    public ResponseEntity<ApiResponse<List<TimeSeriesDataPoint>>> getDashboardTimeSeries() {
        return ResponseEntity.ok(ApiResponse.ok(
                analyticsService.getDashboardTimeSeries(WorkspaceContext.getCurrentWorkspaceId())
        ));
    }
}
