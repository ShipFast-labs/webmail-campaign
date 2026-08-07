package com.example.emailcampaign.contact.dto;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;



public record ContactResponse(
        UUID id,
        UUID workspaceId,
        String email,
        String firstName,
        String lastName,
        String status,
        Map<String, Object> customFields,
        String[] tags,
        Instant createdAt,
        Instant updatedAt
) {

}
