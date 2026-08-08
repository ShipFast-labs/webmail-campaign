package com.example.emailcampaign.template.dto;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record TemplateResponse(
        UUID id,
        UUID workspaceId,
        String name,
        String subject,
        String htmlContent,
        String textContent,
        Map<String, String> variables,
        Instant createdAt,
        Instant updatedAt
) {}
