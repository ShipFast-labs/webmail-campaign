package com.example.emailcampaign.outbox.service;

import com.example.emailcampaign.outbox.domain.OutboxEvent;
import com.example.emailcampaign.outbox.domain.OutboxStatus;
import com.example.emailcampaign.outbox.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
@RequiredArgsConstructor
public class OutboxRelayService {

    private static final int BATCH_SIZE = 20;
    private static final int KAFKA_TIMEOUT_SECONDS = 3;
    private static final long MAX_BACKOFF_MS = 64_000L;

    private final OutboxEventRepository outboxEventRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    private final AtomicInteger consecutiveFailures = new AtomicInteger(0);
    private final AtomicLong backoffUntilMs = new AtomicLong(0);

    @Scheduled(fixedDelayString = "${app.outbox.relay-interval-ms:500}")
    @Transactional
    public void relay() {
        if (System.currentTimeMillis() < backoffUntilMs.get()) {
            return;
        }

        List<OutboxEvent> pending = outboxEventRepository.findPendingAndLock(BATCH_SIZE);
        if (pending.isEmpty()) {
            return;
        }

        int failures = 0;
        Instant now = Instant.now();

        for (OutboxEvent event : pending) {
            try {
                kafkaTemplate
                    .send(event.getTopic(), event.getAggregateId().toString(), event.getPayload())
                    .get(KAFKA_TIMEOUT_SECONDS, TimeUnit.SECONDS);

                event.setStatus(OutboxStatus.PUBLISHED);
                event.setPublishedAt(now);
            } catch (Exception e) {
                log.error("Failed to relay outbox event {} (type={}): {}",
                    event.getId(), event.getEventType(), e.getMessage());
                failures++;
            }
        }

        if (failures > 0) {
            int total = consecutiveFailures.addAndGet(failures);
            long backoffMs = Math.min(1_000L << Math.min(total, 6), MAX_BACKOFF_MS);
            backoffUntilMs.set(System.currentTimeMillis() + backoffMs);
            log.warn("Kafka relay failures: {}. Backing off for {}ms", total, backoffMs);
        } else {
            consecutiveFailures.set(0);
            backoffUntilMs.set(0);
        }
    }
}
