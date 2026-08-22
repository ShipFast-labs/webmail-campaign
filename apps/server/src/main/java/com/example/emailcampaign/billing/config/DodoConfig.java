package com.example.emailcampaign.billing.config;

import com.example.emailcampaign.config.AppProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestClient;

@Configuration
public class DodoConfig {

    @Bean
    public RestClient dodoRestClient(AppProperties properties) {
        AppProperties.Dodo dodo = properties.getDodo();
        return RestClient.builder()
                .baseUrl(dodo.getApiBaseUrl())
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + dodo.getApiKey())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                .build();
    }
}
