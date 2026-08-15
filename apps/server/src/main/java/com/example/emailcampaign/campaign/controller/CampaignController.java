package com.example.emailcampaign.campaign.controller;

import com.example.emailcampaign.analytics.dto.CampaignAnalyticsResponse;
import com.example.emailcampaign.analytics.dto.TimeSeriesDataPoint;
import com.example.emailcampaign.analytics.service.AnalyticsService;
import com.example.emailcampaign.campaign.dto.CampaignContactResponse;
import com.example.emailcampaign.campaign.dto.CampaignResponse;
import com.example.emailcampaign.campaign.dto.CreateCampaignRequest;
import com.example.emailcampaign.campaign.dto.ScheduleCampaignRequest;
import com.example.emailcampaign.campaign.service.CampaignService;
import com.example.emailcampaign.common.api.ApiResponse;
import com.example.emailcampaign.common.context.WorkspaceContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/campaigns")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Campaigns", description = "Campaign lifecycle — create, schedule, send, pause, resume, cancel")
public class CampaignController {

    private final CampaignService campaignService;
    private final AnalyticsService analyticsService;

    @GetMapping
    @Operation(summary = "List campaigns", description = "Returns all campaigns in the current workspace, newest first")
    public ResponseEntity<ApiResponse<List<CampaignResponse>>> getCampaigns() {
        return ResponseEntity.ok(ApiResponse.ok(campaignService.getCampaigns(workspaceId())));
    }

    @PostMapping
    @Operation(summary = "Create campaign", description = "Creates a new campaign in DRAFT status")
    public ResponseEntity<ApiResponse<CampaignResponse>> createCampaign(
            @Valid @RequestBody CreateCampaignRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(campaignService.createCampaign(workspaceId(), request)));
    }

    @GetMapping("/{campaignId}")
    @Operation(summary = "Get campaign", description = "Returns a single campaign by ID")
    public ResponseEntity<ApiResponse<CampaignResponse>> getCampaign(@PathVariable UUID campaignId) {
        return ResponseEntity.ok(ApiResponse.ok(campaignService.getCampaign(workspaceId(), campaignId)));
    }

    @PostMapping("/{campaignId}/send-now")
    @Operation(summary = "Send now", description = "Immediately transitions a DRAFT or SCHEDULED campaign to SENDING")
    public ResponseEntity<ApiResponse<CampaignResponse>> sendNow(@PathVariable UUID campaignId) {
        return ResponseEntity.ok(ApiResponse.ok(campaignService.sendNow(workspaceId(), campaignId)));
    }

    @PostMapping("/{campaignId}/schedule")
    @Operation(summary = "Schedule campaign", description = "Schedules a DRAFT campaign to send at the given time")
    public ResponseEntity<ApiResponse<CampaignResponse>> schedule(
            @PathVariable UUID campaignId,
            @Valid @RequestBody ScheduleCampaignRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(campaignService.schedule(workspaceId(), campaignId, request)));
    }

    @PostMapping("/{campaignId}/pause")
    @Operation(summary = "Pause campaign", description = "Pauses a SENDING campaign")
    public ResponseEntity<ApiResponse<CampaignResponse>> pause(@PathVariable UUID campaignId) {
        return ResponseEntity.ok(ApiResponse.ok(campaignService.pause(workspaceId(), campaignId)));
    }

    @PostMapping("/{campaignId}/resume")
    @Operation(summary = "Resume campaign", description = "Resumes a PAUSED campaign back to SENDING")
    public ResponseEntity<ApiResponse<CampaignResponse>> resume(@PathVariable UUID campaignId) {
        return ResponseEntity.ok(ApiResponse.ok(campaignService.resume(workspaceId(), campaignId)));
    }

    @PostMapping("/{campaignId}/cancel")
    @Operation(summary = "Cancel campaign", description = "Cancels a campaign from any non-terminal status")
    public ResponseEntity<ApiResponse<CampaignResponse>> cancel(@PathVariable UUID campaignId) {
        return ResponseEntity.ok(ApiResponse.ok(campaignService.cancel(workspaceId(), campaignId)));
    }

    @GetMapping("/{campaignId}/contacts")
    @Operation(summary = "List campaign recipients", description = "Paginated list of contacts for this campaign with their send status")
    public ResponseEntity<ApiResponse<List<CampaignContactResponse>>> getCampaignContacts(
            @PathVariable UUID campaignId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(campaignService.getCampaignContacts(workspaceId(), campaignId, page, size));
    }

    @GetMapping("/{campaignId}/analytics")
    @Operation(summary = "Campaign analytics", description = "Sent, delivered, opened, clicked, bounced counts for a campaign")
    public ResponseEntity<ApiResponse<CampaignAnalyticsResponse>> getCampaignAnalytics(
            @PathVariable UUID campaignId) {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getCampaignAnalytics(campaignId)));
    }

    @GetMapping("/{campaignId}/analytics/timeseries")
    @Operation(summary = "Campaign timeseries", description = "Daily opens, clicks, sends for a campaign")
    public ResponseEntity<ApiResponse<List<TimeSeriesDataPoint>>> getCampaignTimeSeries(
            @PathVariable UUID campaignId) {
        return ResponseEntity.ok(ApiResponse.ok(analyticsService.getCampaignTimeSeries(campaignId)));
    }

    private UUID workspaceId() {
        return WorkspaceContext.getCurrentWorkspaceId();
    }
}
