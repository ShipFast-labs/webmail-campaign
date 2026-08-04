package com.example.emailcampaign.auth.service;

import com.example.emailcampaign.auth.dto.AuthResponse;
import com.example.emailcampaign.auth.dto.LoginRequest;
import com.example.emailcampaign.auth.dto.RefreshTokenRequest;
import com.example.emailcampaign.auth.dto.RegisterRequest;
import com.example.emailcampaign.auth.dto.TokenResponse;
import com.example.emailcampaign.auth.dto.UserResponse;

import java.util.UUID;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    TokenResponse refresh(RefreshTokenRequest request);
    void logout(String refreshToken);
    UserResponse getMe(UUID userId);
}
