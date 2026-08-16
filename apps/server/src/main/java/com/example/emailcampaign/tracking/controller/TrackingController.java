package com.example.emailcampaign.tracking.controller;

import com.example.emailcampaign.config.AppProperties;
import com.example.emailcampaign.tracking.service.TrackingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;
import java.util.UUID;

@RestController
@RequestMapping("/t")
@RequiredArgsConstructor
public class TrackingController {

    private static final byte[] TRANSPARENT_GIF = Base64.getDecoder().decode(
            "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    );

    private final TrackingService trackingService;
    private final AppProperties appProperties;

    @GetMapping("/o/{token}")
    public ResponseEntity<byte[]> trackOpen(@PathVariable UUID token, HttpServletRequest request) {
        trackingService.recordOpen(token, request.getHeader(HttpHeaders.USER_AGENT));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("image/gif"))
                .header(HttpHeaders.CACHE_CONTROL, "no-store, no-cache, must-revalidate")
                .header(HttpHeaders.PRAGMA, "no-cache")
                .body(TRANSPARENT_GIF);
    }

    @GetMapping("/u/{token}")
    public ResponseEntity<Void> trackUnsubscribe(@PathVariable UUID token) {
        trackingService.recordUnsubscribe(token);
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, appProperties.getFrontend().getUrl() + "/unsubscribed")
                .build();
    }

    @GetMapping("/c/{token}")
    public ResponseEntity<Void> trackClick(@PathVariable UUID token) {
        return trackingService.recordClickAndGetRedirectUrl(token)
                .map(url -> ResponseEntity.<Void>status(HttpStatus.FOUND)
                        .header(HttpHeaders.LOCATION, url)
                        .build())
                .orElse(ResponseEntity.notFound().build());
    }
}
