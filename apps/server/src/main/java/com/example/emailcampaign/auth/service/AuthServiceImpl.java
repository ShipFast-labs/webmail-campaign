package com.example.emailcampaign.auth.service;

import com.example.emailcampaign.auth.domain.AuthProvider;
import com.example.emailcampaign.auth.domain.RefreshToken;
import com.example.emailcampaign.auth.domain.User;
import com.example.emailcampaign.auth.dto.AuthResponse;
import com.example.emailcampaign.auth.dto.LoginRequest;
import com.example.emailcampaign.auth.dto.RefreshTokenRequest;
import com.example.emailcampaign.auth.dto.RegisterRequest;
import com.example.emailcampaign.auth.dto.TokenResponse;
import com.example.emailcampaign.auth.dto.UserResponse;
import com.example.emailcampaign.auth.repository.RefreshTokenRepository;
import com.example.emailcampaign.auth.repository.UserRepository;
import com.example.emailcampaign.auth.security.JwtTokenProvider;
import com.example.emailcampaign.common.exception.ApiException;
import com.example.emailcampaign.config.AppProperties;
import com.example.emailcampaign.workspace.domain.Workspace;
import com.example.emailcampaign.workspace.domain.WorkspaceRole;
import com.example.emailcampaign.workspace.dto.WorkspaceResponse;
import com.example.emailcampaign.workspace.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final WorkspaceService workspaceService;
    private final AppProperties appProperties;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw ApiException.conflict("EMAIL_ALREADY_EXISTS", "Email address is already registered");
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName()
        );
        user = userRepository.save(user);

        // Auto-create default workspace
        Workspace defaultWorkspace = workspaceService.createWorkspace(
                request.getFullName() + "'s Workspace", user.getId());

        TokenResponse tokens = generateTokens(user.getId(), user.getEmail());

        return new AuthResponse(
                UserResponse.from(user),
                tokens,
                WorkspaceResponse.from(defaultWorkspace, WorkspaceRole.ADMIN)
        );
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> ApiException.notFound("USER_NOT_FOUND", "User not found"));

        TokenResponse tokens = generateTokens(user.getId(), user.getEmail());

        List<WorkspaceResponse> userWorkspaces = workspaceService.getUserWorkspaces(user.getId());
        WorkspaceResponse activeWorkspace = userWorkspaces.isEmpty() ? null : userWorkspaces.get(0);

        return new AuthResponse(UserResponse.from(user), tokens, activeWorkspace);
    }

    @Override
    @Transactional
    public TokenResponse refresh(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenString(request.getRefreshToken())
                .orElseThrow(() -> ApiException.unauthorized("INVALID_REFRESH_TOKEN", "Refresh token is invalid"));

        if (refreshToken.isRevoked() || refreshToken.getExpiresAt().isBefore(Instant.now())) {
            throw ApiException.unauthorized("EXPIRED_REFRESH_TOKEN", "Refresh token has expired or been revoked");
        }

        User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> ApiException.notFound("USER_NOT_FOUND", "User not found"));

        // Rotate tokens
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        return generateTokens(user.getId(), user.getEmail());
    }

    @Override
    @Transactional
    public void logout(String refreshTokenString) {
        refreshTokenRepository.findByTokenString(refreshTokenString).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getMe(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("USER_NOT_FOUND", "User not found"));
        return UserResponse.from(user);
    }

    private TokenResponse generateTokens(UUID userId, String email) {
        String accessToken = tokenProvider.generateAccessToken(userId, email);
        String refreshTokenString = tokenProvider.generateRefreshToken(userId);

        RefreshToken refreshToken = new RefreshToken(
                refreshTokenString,
                userId,
                Instant.now().plusMillis(appProperties.getJwt().getRefreshTokenExpirationMs())
        );
        refreshTokenRepository.save(refreshToken);

        long expiresInSeconds = appProperties.getJwt().getAccessTokenExpirationMs() / 1000;
        return new TokenResponse(accessToken, refreshTokenString, expiresInSeconds);
    }
    @Override
    @Transactional
    public TokenResponse processOAuth2PostLogin(String email, String name, String providerId, String avatarUrl) {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User(email, name, AuthProvider.GOOGLE, providerId, avatarUrl);
            newUser = userRepository.save(newUser);
            workspaceService.createWorkspace(name + "'s Workspace", newUser.getId());
            return newUser;
        });

        if (user.getAvatarUrl() == null && avatarUrl != null) {
            user.setAvatarUrl(avatarUrl);
            userRepository.save(user);
        }
        
        return generateTokens(user.getId(), user.getEmail());
    }
}
