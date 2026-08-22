package com.example.emailcampaign.billing.dto;

public record CreditPackageResponse(String id, String name, long credits, long priceCents, String currency) {}
