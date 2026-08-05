package com.example.emailcampaign.auth.security;

import com.example.emailcampaign.auth.dto.TokenResponse;
import com.example.emailcampaign.auth.service.AuthService;
import com.example.emailcampaign.config.AppProperties;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthService authService;
    private final AppProperties appProperties;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getName(); // Usually the subject ID in Google OAuth2
        String avatarUrl = oAuth2User.getAttribute("picture"); // Google returns the profile picture in the "picture" attribute

        log.info("OAuth2 login success for email: {}", email);

        // Process the login and get JWT tokens
        TokenResponse tokenResponse = authService.processOAuth2PostLogin(email, name, providerId, avatarUrl);

        // Redirect to frontend with tokens
        String targetUrl = UriComponentsBuilder.fromUriString(appProperties.getFrontend().getOauth2RedirectUrl())
                .queryParam("accessToken", tokenResponse.getAccessToken())
                .queryParam("refreshToken", tokenResponse.getRefreshToken())
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
