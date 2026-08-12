package com.example.emailcampaign.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.codec.ByteArrayCodec;
import io.lettuce.core.codec.RedisCodec;
import io.lettuce.core.codec.StringCodec;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;
import java.util.function.Supplier;

@Slf4j
@Service
public class RateLimiterService {

    private final ProxyManager<String> proxyManager;
    private final Supplier<BucketConfiguration> bucketConfig;
    private final String keyPrefix;

    public RateLimiterService(
            RedisClient lettuceRedisClient,
            @Value("${app.redis.key-prefix}") String keyPrefix,
            @Value("${app.rate-limit.max-tokens:200}") int maxTokens,
            @Value("${app.rate-limit.refill-rate-per-second:10}") int refillRatePerSecond) {

        StatefulRedisConnection<String, byte[]> connection =
                lettuceRedisClient.connect(RedisCodec.of(StringCodec.UTF8, ByteArrayCodec.INSTANCE));

        this.proxyManager = LettuceBasedProxyManager.builderFor(connection).build();

        this.bucketConfig = () -> BucketConfiguration.builder()
                .addLimit(Bandwidth.builder()
                        .capacity(maxTokens)
                        .refillGreedy(refillRatePerSecond, Duration.ofSeconds(1))
                        .build())
                .build();

        this.keyPrefix = keyPrefix;
    }

    /**
     * Atomically attempts to consume {@code tokens} from this workspace's distributed token bucket.
     *
     * @return true  — tokens available, proceed with send
     *         false — bucket exhausted, caller should back off and retry
     */
    public boolean tryConsume(UUID workspaceId, int tokens) {
        String key = keyPrefix + "rate_limit:" + workspaceId;
        boolean allowed = proxyManager
                .builder()
                .build(key, bucketConfig)
                .tryConsume(tokens);

        if (!allowed) {
            log.warn("Rate limit hit: workspace={}", workspaceId);
        }
        return allowed;
    }
}
