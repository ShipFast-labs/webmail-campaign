package com.example.emailcampaign.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.BucketConfiguration;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.function.Supplier;

@Component
@RequiredArgsConstructor
public class PublicApiRateLimitFilter extends OncePerRequestFilter {

    // 5 registrations per hour per IP — prevents mass account creation
    private static final Supplier<BucketConfiguration> REGISTER_CONFIG = () ->
            BucketConfiguration.builder()
                    .addLimit(Bandwidth.builder()
                            .capacity(5)
                            .refillGreedy(5, Duration.ofHours(1))
                            .build())
                    .build();

    // 20 login attempts per 10 minutes per IP — brute force protection
    private static final Supplier<BucketConfiguration> LOGIN_CONFIG = () ->
            BucketConfiguration.builder()
                    .addLimit(Bandwidth.builder()
                            .capacity(20)
                            .refillGreedy(20, Duration.ofMinutes(10))
                            .build())
                    .build();

    private final RateLimiterService rateLimiterService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        Supplier<BucketConfiguration> config = null;
        String bucketKey = null;

        if ("POST".equals(method) && path.equals("/api/v1/auth/register")) {
            config = REGISTER_CONFIG;
            bucketKey = "public:register:" + getClientIp(request);
        } else if ("POST".equals(method) && path.equals("/api/v1/auth/login")) {
            config = LOGIN_CONFIG;
            bucketKey = "public:login:" + getClientIp(request);
        }

        if (config != null && !rateLimiterService.tryConsumeForKey(bucketKey, 1, config)) {
            response.setStatus(429);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"error\":\"TOO_MANY_REQUESTS\",\"message\":\"Too many requests. Please try again later.\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
