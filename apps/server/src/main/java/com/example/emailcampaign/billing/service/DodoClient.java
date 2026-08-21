package com.example.emailcampaign.billing.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DodoClient {

    private final RestClient dodoRestClient;

    public List<DodoProduct> listOneTimeProducts() {
        DodoProductListResponse response = dodoRestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/products")
                        .queryParam("recurring", false)
                        .queryParam("page_size", 100)
                        .build())
                .retrieve()
                .body(DodoProductListResponse.class);

        return response != null && response.items() != null ? response.items() : List.of();
    }

    public CheckoutSession createCheckoutSession(String dodoProductId, String returnUrl, UUID workspaceId) {
        CheckoutSessionRequest request = new CheckoutSessionRequest(
                List.of(new ProductCartItem(dodoProductId, 1)),
                returnUrl,
                Map.of("workspaceId", workspaceId.toString())
        );

        return dodoRestClient.post()
                .uri("/checkouts")
                .body(request)
                .retrieve()
                .body(CheckoutSession.class);
    }

    private record ProductCartItem(
            @JsonProperty("product_id") String productId,
            int quantity
    ) {}

    private record CheckoutSessionRequest(
            @JsonProperty("product_cart") List<ProductCartItem> productCart,
            @JsonProperty("return_url") String returnUrl,
            Map<String, String> metadata
    ) {}

    public record CheckoutSession(
            @JsonProperty("session_id") String sessionId,
            @JsonProperty("checkout_url") String checkoutUrl
    ) {}

    private record DodoProductListResponse(List<DodoProduct> items) {}

    public record DodoProduct(
            @JsonProperty("product_id") String productId,
            String name,
            Long price,
            String currency,
            Map<String, String> metadata
    ) {}
}
