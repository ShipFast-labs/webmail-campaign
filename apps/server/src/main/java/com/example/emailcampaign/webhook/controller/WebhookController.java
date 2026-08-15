package com.example.emailcampaign.webhook.controller;

import com.example.emailcampaign.webhook.service.WebhookProcessorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final WebhookProcessorService processorService;

    @PostMapping("/resend/events")
    public ResponseEntity<Void> resendWebhook(
            @RequestHeader(value = "svix-id", required = false) String svixId,
            @RequestHeader(value = "svix-timestamp", required = false) String svixTimestamp,
            @RequestHeader(value = "svix-signature", required = false) String svixSignature,
            @RequestBody String rawBody
    ) {
        if (svixId != null && svixSignature != null) {
            if (!processorService.isValidResendSignature(svixId, svixTimestamp, svixSignature, rawBody)) {
                log.warn("Rejected Resend webhook — invalid signature");
                return ResponseEntity.ok().build();
            }
        }

        processorService.processResendEvent(rawBody);
        return ResponseEntity.ok().build();
    }
}
