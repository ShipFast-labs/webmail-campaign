package com.example.emailcampaign.contact.dto;

import java.util.UUID;

public record ImportProgressResponse(
        UUID jobId,
        String status,
        int totalRows,
        int processedRows,
        int successCount,
        int errorCount,
        String errorDetails
) {}
