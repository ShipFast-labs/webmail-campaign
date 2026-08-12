package com.example.emailcampaign.campaign.service;

import com.example.emailcampaign.campaign.dto.CampaignResponse;
import com.example.emailcampaign.campaign.dto.CreateCampaignRequest;
import com.example.emailcampaign.campaign.dto.ScheduleCampaignRequest;

import java.util.List;
import java.util.UUID;

public interface CampaignService {

    List<CampaignResponse> getCampaigns(UUID workspaceId);

    CampaignResponse getCampaign(UUID workspaceId, UUID campaignId);

    CampaignResponse createCampaign(UUID workspaceId, CreateCampaignRequest request);

    CampaignResponse sendNow(UUID workspaceId, UUID campaignId);

    CampaignResponse schedule(UUID workspaceId, UUID campaignId, ScheduleCampaignRequest request);

    CampaignResponse pause(UUID workspaceId, UUID campaignId);

    CampaignResponse resume(UUID workspaceId, UUID campaignId);

    CampaignResponse cancel(UUID workspaceId, UUID campaignId);
}
