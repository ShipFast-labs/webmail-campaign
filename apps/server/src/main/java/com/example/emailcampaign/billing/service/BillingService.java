package com.example.emailcampaign.billing.service;

import com.example.emailcampaign.billing.domain.CreditPurchase;
import com.example.emailcampaign.billing.domain.CreditPurchaseStatus;
import com.example.emailcampaign.billing.dto.CreditPackageResponse;
import com.example.emailcampaign.billing.repository.CreditPurchaseRepository;
import com.example.emailcampaign.common.exception.ApiException;
import com.example.emailcampaign.config.AppProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BillingService {

    private static final String CREDITS_METADATA_KEY = "credits";

    private final CreditPurchaseRepository creditPurchaseRepository;
    private final CreditService creditService;
    private final DodoClient dodoClient;
    private final AppProperties appProperties;
    private final ObjectMapper objectMapper;

    public List<CreditPackageResponse> getPackages() {
        return dodoClient.listOneTimeProducts().stream()
                .map(p -> new CreditPackageResponse(p.productId(), p.name(), creditsOf(p), p.price(), p.currency()))
                .filter(p -> p.credits() > 0)
                .toList();
    }

    @Transactional
    public String createCheckoutSession(UUID workspaceId, String productId) {
        DodoClient.DodoProduct product = dodoClient.listOneTimeProducts().stream()
                .filter(p -> p.productId().equals(productId))
                .findFirst()
                .orElseThrow(() -> ApiException.notFound("PACK_NOT_FOUND", "Unknown credit pack: " + productId));

        long credits = creditsOf(product);
        if (credits <= 0) {
            throw ApiException.badRequest("INVALID_PACK",
                    "Product is not configured as a credit pack (missing '" + CREDITS_METADATA_KEY + "' metadata): " + productId);
        }

        DodoClient.CheckoutSession session = dodoClient.createCheckoutSession(
                product.productId(), appProperties.getDodo().getReturnUrl(), workspaceId
        );

        CreditPurchase purchase = CreditPurchase.builder()
                .workspaceId(workspaceId)
                .packId(product.productId())
                .credits(credits)
                .amountCents(product.price() != null ? product.price() : 0)
                .status(CreditPurchaseStatus.PENDING)
                .dodoSessionId(session.sessionId())
                .build();
        creditPurchaseRepository.save(purchase);

        return session.checkoutUrl();
    }

    private long creditsOf(DodoClient.DodoProduct product) {
        if (product.metadata() == null) return 0;
        String raw = product.metadata().get(CREDITS_METADATA_KEY);
        if (raw == null || raw.isBlank()) return 0;
        try {
            return Long.parseLong(raw.trim());
        } catch (NumberFormatException e) {
            log.warn("Invalid '{}' metadata on Dodo product {}: {}", CREDITS_METADATA_KEY, product.productId(), raw);
            return 0;
        }
    }

    public boolean isValidDodoSignature(String webhookId, String webhookTimestamp,
                                         String webhookSignature, String rawBody) {
        String secret = appProperties.getDodo().getWebhookSecret();
        if (secret == null || secret.isBlank()) {
            log.warn("Dodo webhook signing secret not configured — skipping validation");
            return true;
        }

        try {
            String signedContent = webhookId + "." + webhookTimestamp + "." + rawBody;

            byte[] secretBytes = Base64.getDecoder().decode(secret.replaceFirst("^whsec_", ""));

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secretBytes, "HmacSHA256"));
            String computed = "v1," + Base64.getEncoder().encodeToString(mac.doFinal(signedContent.getBytes()));

            for (String sig : webhookSignature.split(" ")) {
                if (sig.equals(computed)) return true;
            }

            log.warn("Dodo webhook signature mismatch");
            return false;
        } catch (Exception e) {
            log.error("Dodo webhook signature validation failed: {}", e.getMessage());
            return false;
        }
    }

    public void processWebhookEvent(String rawBody) {
        try {
            JsonNode root = objectMapper.readTree(rawBody);
            String eventType = root.path("type").asText();
            JsonNode data = root.path("data");

            switch (eventType) {
                case "payment.succeeded" -> handlePaymentSucceeded(data);
                case "payment.failed" -> handlePaymentFailed(data);
                default -> log.debug("Unhandled Dodo event type: {}", eventType);
            }
        } catch (Exception e) {
            log.error("Failed to process Dodo webhook: {}", e.getMessage(), e);
        }
    }

    private void handlePaymentSucceeded(JsonNode data) {
        String paymentId = data.path("payment_id").asText(null);
        String sessionId = data.path("checkout_session_id").asText(null);

        CreditPurchase purchase = findPurchase(paymentId, sessionId);
        if (purchase == null) return;

        if (purchase.getStatus() == CreditPurchaseStatus.COMPLETED) {
            log.debug("Dodo payment {} already completed, skipping", paymentId);
            return;
        }

        purchase.setDodoPaymentId(paymentId);
        purchase.setStatus(CreditPurchaseStatus.COMPLETED);
        creditPurchaseRepository.save(purchase);
        creditService.addCredits(purchase.getWorkspaceId(), purchase.getCredits());
        log.info("Completed credit purchase={} workspace={} credits={}",
                purchase.getId(), purchase.getWorkspaceId(), purchase.getCredits());
    }

    private void handlePaymentFailed(JsonNode data) {
        String paymentId = data.path("payment_id").asText(null);
        String sessionId = data.path("checkout_session_id").asText(null);

        CreditPurchase purchase = findPurchase(paymentId, sessionId);
        if (purchase == null) return;

        if (purchase.getStatus() != CreditPurchaseStatus.PENDING) {
            return;
        }

        purchase.setDodoPaymentId(paymentId);
        purchase.setStatus(CreditPurchaseStatus.FAILED);
        creditPurchaseRepository.save(purchase);
        log.info("Failed credit purchase={} workspace={}", purchase.getId(), purchase.getWorkspaceId());
    }

    private CreditPurchase findPurchase(String paymentId, String sessionId) {
        if (paymentId != null) {
            var byPaymentId = creditPurchaseRepository.findByDodoPaymentId(paymentId);
            if (byPaymentId.isPresent()) return byPaymentId.get();
        }
        if (sessionId != null) {
            return creditPurchaseRepository.findByDodoSessionId(sessionId).orElse(null);
        }
        log.warn("Dodo webhook missing both payment_id and checkout_session_id, cannot match purchase");
        return null;
    }
}
