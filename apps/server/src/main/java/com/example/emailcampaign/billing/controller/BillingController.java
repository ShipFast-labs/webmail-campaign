package com.example.emailcampaign.billing.controller;

import com.example.emailcampaign.billing.dto.BalanceResponse;
import com.example.emailcampaign.billing.dto.CheckoutRequest;
import com.example.emailcampaign.billing.dto.CheckoutResponse;
import com.example.emailcampaign.billing.dto.CreditPackageResponse;
import com.example.emailcampaign.billing.service.BillingService;
import com.example.emailcampaign.billing.service.CreditService;
import com.example.emailcampaign.common.api.ApiResponse;
import com.example.emailcampaign.common.context.WorkspaceContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/billing")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Billing", description = "Email credit packages and Dodo Payments checkout")
public class BillingController {

    private final BillingService billingService;
    private final CreditService creditService;

    @GetMapping("/packages")
    @Operation(summary = "List credit packages", description = "Returns the available email credit packs for purchase")
    public ApiResponse<List<CreditPackageResponse>> getPackages() {
        return ApiResponse.ok(billingService.getPackages());
    }

    @GetMapping("/balance")
    @Operation(summary = "Get credit balance", description = "Returns the current workspace's remaining email credits")
    public ApiResponse<BalanceResponse> getBalance() {
        return ApiResponse.ok(new BalanceResponse(creditService.getBalance(workspaceId())));
    }

    @PostMapping("/checkout")
    @Operation(summary = "Create checkout session", description = "Creates a Dodo Payments checkout session for a credit pack")
    public ApiResponse<CheckoutResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        String checkoutUrl = billingService.createCheckoutSession(workspaceId(), request.packId());
        return ApiResponse.ok(new CheckoutResponse(checkoutUrl));
    }

    private UUID workspaceId() {
        return WorkspaceContext.getCurrentWorkspaceId();
    }
}
