package com.example.emailcampaign.config;

import io.lettuce.core.RedisClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RedisClientConfig {

    // Exposes a raw Lettuce RedisClient bean used by Bucket4j's LettuceBasedProxyManager.
    // Spring Boot auto-configures its own connection factory separately — this bean is additive.
    @Bean(destroyMethod = "shutdown")
    public RedisClient lettuceRedisClient(@Value("${spring.data.redis.url}") String redisUrl) {
        return RedisClient.create(redisUrl);
    }
}
