package com.example.emailcampaign.billing.controller;

import com.example.emailcampaign.billing.service.BillingService;
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
public class DodoWebhookController {

    private final BillingService billingService;

    @PostMapping("/dodo")
    public ResponseEntity<Void> dodoWebhook(
            @RequestHeader(value = "webhook-id", required = false) String webhookId,
            @RequestHeader(value = "webhook-timestamp", required = false) String webhookTimestamp,
            @RequestHeader(value = "webhook-signature", required = false) String webhookSignature,
            @RequestBody String rawBody
    ) {
        if (webhookId != null && webhookSignature != null) {
            if (!billingService.isValidDodoSignature(webhookId, webhookTimestamp, webhookSignature, rawBody)) {
                log.warn("Rejected Dodo webhook — invalid signature");
                return ResponseEntity.ok().build();
            }
        }

        billingService.processWebhookEvent(rawBody);
        return ResponseEntity.ok().build();
    }
}
