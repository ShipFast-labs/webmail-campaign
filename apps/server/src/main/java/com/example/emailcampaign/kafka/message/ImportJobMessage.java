package com.example.emailcampaign.kafka.message;

import java.util.UUID;

public record ImportJobMessage(UUID workspaceId, UUID jobId) {}
