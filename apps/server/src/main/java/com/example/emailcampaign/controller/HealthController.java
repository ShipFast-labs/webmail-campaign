package com.example.emailcampaign.controller;

import com.example.emailcampaign.common.api.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/health")
@Tag(name = "System & Health", description = "Public endpoints for checking backend service operational status")
public class HealthController {

    @GetMapping
    @Operation(summary = "Check service health", description = "Returns status UP when the API server is running and healthy.")
    @SecurityRequirements()
    public ResponseEntity<ApiResponse<Map<String, String>>> health() {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("status", "UP", "service", "email-campaign-backend")));
    }
}
