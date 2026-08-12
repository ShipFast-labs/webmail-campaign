package com.example.emailcampaign.kafka.message;

import java.util.UUID;

public record CampaignScheduledMessage(UUID campaignId, UUID workspaceId) {}
