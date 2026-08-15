package com.example.emailcampaign.kafka.message;

import java.util.UUID;

public record ContactEventMessage(UUID workspaceId, UUID contactId, String eventType) {}
