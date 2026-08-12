package com.example.emailcampaign.kafka.message;

import java.util.List;
import java.util.UUID;

public record EmailSendBatchMessage(
        UUID campaignId,
        UUID workspaceId,
        List<EmailContactInfo> contacts
) {}
