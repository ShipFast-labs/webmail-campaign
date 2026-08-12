package com.example.emailcampaign.campaign.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateCampaignRequest(
        @NotBlank(message = "Campaign name is required") String name,
        @NotBlank(message = "Subject line is required") String subject,
        @NotBlank(message = "From name is required") String fromName,
        @Email(message = "From email must be a valid email address")
        @NotBlank(message = "From email is required") String fromEmail,
        @NotNull(message = "Template is required") UUID templateId,
        @NotNull(message = "Audience list is required") UUID targetListId
) {}
