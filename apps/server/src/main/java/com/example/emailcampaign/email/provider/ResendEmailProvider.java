package com.example.emailcampaign.email.provider;

import com.example.emailcampaign.email.EmailMessage;
import com.example.emailcampaign.email.EmailProvider;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
public class ResendEmailProvider implements EmailProvider {

    private final Resend resend;
    private final String platformFromEmail;

    public ResendEmailProvider(String apiKey, String platformFromEmail) {
        this.resend = new Resend(apiKey);
        this.platformFromEmail = platformFromEmail;
    }

    @Override
    public void send(EmailMessage message) {
        CreateEmailOptions options = CreateEmailOptions.builder()
                .from(formatAddress(message.fromName(), platformFromEmail))
                .to(List.of(message.toEmail()))
                .subject(message.subject())
                .html(message.htmlBody())
                .build();

        try {
            resend.emails().send(options);
            log.debug("Resend: delivered to={} key={}", message.toEmail(), message.idempotencyKey());
        } catch (ResendException e) {
            throw new RuntimeException(
                    "Resend send failed for " + message.toEmail() + ": " + e.getMessage(), e);
        }
    }

    private String formatAddress(String name, String email) {
        return (name != null && !name.isBlank()) ? name + " <" + email + ">" : email;
    }
}
