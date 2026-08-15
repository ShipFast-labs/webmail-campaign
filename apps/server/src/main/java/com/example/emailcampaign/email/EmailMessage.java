package com.example.emailcampaign.email;

public record EmailMessage(
        String toEmail,
        String toName,
        String fromEmail,
        String fromName,
        String subject,
        String htmlBody,
        String idempotencyKey
) {}
