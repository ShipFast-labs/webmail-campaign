package com.example.emailcampaign.auth.controller;

import com.example.emailcampaign.auth.dto.AuthResponse;
import com.example.emailcampaign.auth.dto.LoginRequest;
import com.example.emailcampaign.auth.dto.RefreshTokenRequest;
import com.example.emailcampaign.auth.dto.RegisterRequest;
import com.example.emailcampaign.auth.dto.TokenResponse;
import com.example.emailcampaign.auth.dto.UserResponse;
import com.example.emailcampaign.auth.security.UserPrincipal;
import com.example.emailcampaign.auth.service.AuthService;
import com.example.emailcampaign.common.api.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication & Identity", description = "Endpoints for user registration, JWT login, token refresh, logout, and profile query")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Creates a new user account, automatically provisions a default workspace, and returns JWT tokens.")
    @SecurityRequirements()
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with credentials", description = "Authenticates user email and password and returns access & refresh JWT tokens.")
    @SecurityRequirements()
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Rotates refresh token and issues a fresh JWT access token.")
    @SecurityRequirements()
    public ResponseEntity<ApiResponse<TokenResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        TokenResponse response = authService.refresh(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout and revoke token", description = "Revokes the supplied refresh token.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user profile", description = "Returns details of the currently authenticated user based on JWT Bearer token.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<UserResponse>> me(@AuthenticationPrincipal UserPrincipal principal) {
        UserResponse response = authService.getMe(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
