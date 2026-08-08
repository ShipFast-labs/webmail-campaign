package com.example.emailcampaign.list.dto;

import java.time.Instant;
import java.util.UUID;

public record ListContactResponse(
        UUID contactId,
        String email,
        String firstName,
        String lastName,
        String status,
        Instant addedAt
) {}
