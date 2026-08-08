package com.example.emailcampaign.list.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record BulkContactRequest(

        @NotEmpty(message = "At least one contact ID is required")
        @Size(max = 500, message = "Cannot add more than 500 contacts at once")
        List<UUID> contactIds
) {}
