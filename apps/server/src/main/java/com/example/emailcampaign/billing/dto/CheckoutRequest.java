package com.example.emailcampaign.billing.dto;

import jakarta.validation.constraints.NotBlank;

public record CheckoutRequest(
        @NotBlank(message = "Pack id is required") String packId
) {}
