package com.example.emailcampaign.template.dto;

import java.util.Map;

public record TemplatePreviewRequest(
        Map<String, String> variables
) {}
