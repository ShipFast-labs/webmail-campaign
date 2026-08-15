# Day 8 — Remaining Work

## Fix: fromEmail Override

Every campaign sends from whatever the user typed in `fromEmail`.
Since we have one verified Resend domain, override `fromEmail` in `ResendEmailProvider`
to always use the platform domain (e.g. `noreply@yourdomain.com`) while keeping `fromName`
as the customer's brand name.

**1 file, 2 lines.**

---

## Day 8A — Analytics (HIGH PRIORITY — dashboard + analytics page return 404)

| File | What |
|---|---|
| `tracking/domain/TrackingEvent.java` | Entity for `tracking_events` table *(created)* |
| `tracking/repository/TrackingEventRepository.java` | Queries: count by type, timeseries, workspace aggregates *(created)* |
| `analytics/consumer/AnalyticsConsumer.java` | `@KafkaListener` on `email.tracking.events` → saves rows to `tracking_events` |
| `analytics/controller/AnalyticsController.java` | `GET /analytics/dashboard`, `GET /analytics/dashboard/timeseries` |
| Modify `campaign/controller/CampaignController.java` | Add `GET /campaigns/{id}/analytics`, `GET /campaigns/{id}/analytics/timeseries` |

### API Shapes (must match frontend exactly)

```
GET /api/v1/analytics/dashboard
{
  "totalSent": 1500,
  "openRate": 0.35,
  "clickRate": 0.12,
  "bounceRate": 0.02,
  "sentTrend": 0,
  "openRateTrend": 0,
  "clickRateTrend": 0,
  "bounceRateTrend": 0
}

GET /api/v1/analytics/dashboard/timeseries
[{ "date": "2026-08-01", "opens": 150, "clicks": 45, "sends": 500 }, ...]

GET /api/v1/campaigns/{id}/analytics
{
  "campaignId": "...",
  "totalSent": 500,
  "totalDelivered": 490,
  "totalOpened": 175,
  "totalClicked": 60,
  "totalBounced": 5,
  "totalUnsubscribed": 2
}

GET /api/v1/campaigns/{id}/analytics/timeseries
[{ "date": "2026-08-01", "opens": 80, "clicks": 20, "sends": 500 }, ...]
```

### Data Sources

- `totalSent` — COUNT from `campaign_contacts` WHERE status != PENDING/FAILED
- `totalDelivered` — COUNT from `campaign_contacts` WHERE status = DELIVERED
- `totalOpened` — COUNT from `tracking_events` WHERE event_type = 'OPENED'
- `totalClicked` — COUNT from `tracking_events` WHERE event_type = 'CLICKED'
- `totalBounced` — COUNT from `campaign_contacts` WHERE status = BOUNCED
- `totalUnsubscribed` — COUNT from `campaign_contacts` WHERE status = UNSUBSCRIBED
- Timeseries — GROUP BY day on `tracking_events`

---

## Day 8B — Webhooks (so emails move SENT → DELIVERED / BOUNCED)

| File | What |
|---|---|
| `webhook/controller/WebhookController.java` | `POST /api/v1/webhooks/resend/events` (no JWT auth) |
| `webhook/service/WebhookProcessorService.java` | Parse Resend event, validate signature, update `campaign_contacts.status` |
| Modify `config/SecurityConfig.java` | Add `/api/v1/webhooks/**` to `permitAll` |
| Modify `config/AppProperties.java` | Add `webhook.resend.signing-secret` field |

### Resend Webhook Events to Handle

| Resend event type | Action |
|---|---|
| `email.delivered` | campaign_contacts status → DELIVERED |
| `email.bounced` | campaign_contacts status → BOUNCED, publish to `email.contact.events` |
| `email.complained` | campaign_contacts status → BOUNCED |

### Resend Payload Structure

```json
{
  "type": "email.delivered",
  "data": {
    "email_id": "resend-abc123",
    "headers": [
      { "name": "X-Entity-Ref-Id", "value": "campaignId::contactId" }
    ]
  }
}
```

We extract `campaignId` and `contactId` from the `X-Entity-Ref-Id` header we set at send time.

### Signature Validation (Svix)

Headers: `svix-id`, `svix-timestamp`, `svix-signature`
Signed string: `"{svix-id}.{svix-timestamp}.{rawBody}"`
Algorithm: HMAC-SHA256 with webhook signing secret

> SES webhooks — skip for now (using Resend as primary provider)

---

## Day 8C — Contact Bounce Propagation (nice-to-have)

| File | What |
|---|---|
| `kafka/consumer/ContactEventConsumer.java` | Reads `email.contact.events` → sets `contacts.status` = BOUNCED or UNSUBSCRIBED |

---

## Execution Order

1. `fromEmail` fix
2. Day 8A — Analytics (AnalyticsConsumer → AnalyticsController → campaign analytics endpoints)
3. Day 8B — Webhooks
4. Day 8C — Contact events

## Total Files

~10 files, ~2-3 hours of coding.
