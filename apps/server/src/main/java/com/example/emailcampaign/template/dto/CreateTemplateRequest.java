package com.example.emailcampaign.template.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Map;

public record CreateTemplateRequest(

        @NotBlank(message = "Template name is required")
        @Size(max = 150, message = "Template name must not exceed 150 characters")
        String name,

        @NotBlank(message = "Subject is required")
        @Size(max = 255, message = "Subject must not exceed 255 characters")
        String subject,

        @NotBlank(message = "HTML content is required")
        String htmlContent,

        String textContent,

        Map<String, String> variables
) {}
