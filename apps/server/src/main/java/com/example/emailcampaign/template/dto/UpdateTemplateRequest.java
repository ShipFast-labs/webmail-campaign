package com.example.emailcampaign.template.dto;

import jakarta.validation.constraints.Size;

import java.util.Map;

public record UpdateTemplateRequest(

        @Size(max = 150, message = "Template name must not exceed 150 characters")
        String name,

        @Size(max = 255, message = "Subject must not exceed 255 characters")
        String subject,

        String htmlContent,

        String textContent,

        Map<String, String> variables
) {}
