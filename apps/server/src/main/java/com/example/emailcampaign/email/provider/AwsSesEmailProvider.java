package com.example.emailcampaign.email.provider;

import com.example.emailcampaign.email.EmailMessage;
import com.example.emailcampaign.email.EmailProvider;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sesv2.SesV2Client;
import software.amazon.awssdk.services.sesv2.model.Body;
import software.amazon.awssdk.services.sesv2.model.Content;
import software.amazon.awssdk.services.sesv2.model.Destination;
import software.amazon.awssdk.services.sesv2.model.EmailContent;
import software.amazon.awssdk.services.sesv2.model.Message;
import software.amazon.awssdk.services.sesv2.model.SendEmailRequest;

@Slf4j
public class AwsSesEmailProvider implements EmailProvider {

    private final SesV2Client sesClient;

    public AwsSesEmailProvider(String region) {
        this.sesClient = SesV2Client.builder()
                .region(Region.of(region))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }

    @Override
    public void send(EmailMessage message) {
        SendEmailRequest request = SendEmailRequest.builder()
                .fromEmailAddress(formatAddress(message.fromName(), message.fromEmail()))
                .destination(Destination.builder()
                        .toAddresses(message.toEmail())
                        .build())
                .content(EmailContent.builder()
                        .simple(Message.builder()
                                .subject(utf8Content(message.subject()))
                                .body(Body.builder()
                                        .html(utf8Content(message.htmlBody()))
                                        .build())
                                .build())
                        .build())
                .build();

        try {
            sesClient.sendEmail(request);
            log.debug("SES: delivered to={} key={}", message.toEmail(), message.idempotencyKey());
        } catch (SdkException e) {
            throw new RuntimeException(
                    "SES send failed for " + message.toEmail() + ": " + e.getMessage(), e);
        }
    }

    private String formatAddress(String name, String email) {
        return (name != null && !name.isBlank()) ? name + " <" + email + ">" : email;
    }

    private Content utf8Content(String data) {
        return Content.builder().data(data).charset("UTF-8").build();
    }
}
