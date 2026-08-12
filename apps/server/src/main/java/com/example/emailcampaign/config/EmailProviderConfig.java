package com.example.emailcampaign.config;

import com.example.emailcampaign.email.EmailProvider;
import com.example.emailcampaign.email.provider.AwsSesEmailProvider;
import com.example.emailcampaign.email.provider.ResendEmailProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EmailProviderConfig {

    @Bean
    @ConditionalOnProperty(name = "app.email.provider", havingValue = "resend", matchIfMissing = true)
    public EmailProvider resendEmailProvider(AppProperties properties) {
        return new ResendEmailProvider(properties.getEmail().getResend().getApiKey());
    }

    @Bean
    @ConditionalOnProperty(name = "app.email.provider", havingValue = "ses")
    public EmailProvider sesEmailProvider(AppProperties properties) {
        return new AwsSesEmailProvider(properties.getEmail().getSes().getRegion());
    }
}
