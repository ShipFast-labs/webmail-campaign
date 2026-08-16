package com.example.emailcampaign.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String baseUrl = "http://localhost:8080";

    private final Jwt jwt = new Jwt();
    private final Email email = new Email();
    private final Frontend frontend = new Frontend();
    private final Webhook webhook = new Webhook();

    @Data
    public static class Webhook {
        private String resendSigningSecret = "";
    }

    @Data
    public static class Frontend {
        private String oauth2RedirectUrl;
        private String url = "http://localhost:5173";
    }

    @Data
    public static class Jwt {
        private String secret;
        private long accessTokenExpirationMs = 3600000L;
        private long refreshTokenExpirationMs = 604800000L;
    }

    @Data
    public static class Email {
        private String provider;
        private final Resend resend = new Resend();
        private final Ses ses = new Ses();

        @Data
        public static class Resend {
            private String apiKey;
            private String platformFromEmail = "noreply@namisend.com";
        }

        @Data
        public static class Ses {
            private String region = "us-east-1";
        }
    }
}
