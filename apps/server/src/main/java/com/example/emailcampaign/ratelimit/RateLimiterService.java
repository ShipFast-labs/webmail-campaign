package com.example.emailcampaign.ratelimit;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class RateLimiterService {

    // Token bucket algorithm — runs atomically on Redis.
    //
    // Bucket state stored as a Redis hash:
    //   KEYS[1]  → "tokens" (current count) + "ts" (last-refill timestamp in ms)
    //
    // Args:
    //   ARGV[1] max_tokens   — bucket capacity (burst ceiling)
    //   ARGV[2] refill_rate  — tokens added per second
    //   ARGV[3] requested    — tokens this call wants to consume
    //   ARGV[4] now_ms       — current epoch ms (passed in, not read inside Lua for determinism)
    private static final String TOKEN_BUCKET_SCRIPT = """
            local tokens  = tonumber(redis.call('HGET', KEYS[1], 'tokens'))
            local last_ts = tonumber(redis.call('HGET', KEYS[1], 'ts'))
            local max     = tonumber(ARGV[1])
            local rate    = tonumber(ARGV[2])
            local need    = tonumber(ARGV[3])
            local now     = tonumber(ARGV[4])

            if tokens == nil then
                tokens  = max
                last_ts = now
            end

            local elapsed  = math.max(0, now - last_ts)
            local refilled = math.floor(elapsed * rate / 1000)
            tokens = math.min(max, tokens + refilled)
            if refilled > 0 then
                last_ts = last_ts + math.floor(refilled * 1000 / rate)
            end

            if tokens >= need then
                tokens = tokens - need
                redis.call('HMSET', KEYS[1], 'tokens', tokens, 'ts', last_ts)
                redis.call('PEXPIRE', KEYS[1], 3600000)
                return 1
            else
                redis.call('HMSET', KEYS[1], 'tokens', tokens, 'ts', last_ts)
                redis.call('PEXPIRE', KEYS[1], 3600000)
                return 0
            end
            """;

    private final StringRedisTemplate redis;
    private final RedisScript<Long> script;
    private final String keyPrefix;
    private final int maxTokens;
    private final int refillRatePerSecond;

    public RateLimiterService(
            StringRedisTemplate redis,
            @Value("${app.redis.key-prefix}") String keyPrefix,
            @Value("${app.rate-limit.max-tokens:200}") int maxTokens,
            @Value("${app.rate-limit.refill-rate-per-second:10}") int refillRatePerSecond) {
        this.redis = redis;
        this.script = RedisScript.of(TOKEN_BUCKET_SCRIPT, Long.class);
        this.keyPrefix = keyPrefix;
        this.maxTokens = maxTokens;
        this.refillRatePerSecond = refillRatePerSecond;
    }

    /**
     * Atomically attempts to consume {@code tokens} from this workspace's bucket.
     *
     * @return true  — tokens were available and consumed, proceed with send
     *         false — bucket exhausted, caller should back off and retry
     */
    public boolean tryConsume(UUID workspaceId, int tokens) {
        String key = keyPrefix + "rate_limit:" + workspaceId;
        Long result = redis.execute(
                script,
                List.of(key),
                String.valueOf(maxTokens),
                String.valueOf(refillRatePerSecond),
                String.valueOf(tokens),
                String.valueOf(System.currentTimeMillis())
        );
        boolean allowed = Long.valueOf(1L).equals(result);
        if (!allowed) {
            log.warn("Rate limit hit: workspace={} bucket exhausted", workspaceId);
        }
        return allowed;
    }
}
