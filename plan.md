# Email Campaign Platform — Implementation Plan

## Context

Greenfield project at `/Volumes/Ajay/Development/hackthon-project/email-campaign/`. Building a
production-grade, Mailchimp-like email campaign platform from scratch. No existing code. The goal is
real engineering — not a toy — with multi-tenancy, a Kafka-based batch send pipeline,
open/click/bounce tracking, and a React dashboard.

**Team:** 2 people (Person A = backend lead, Person B = frontend lead)
**Timeline:** August 5–13, 2026 (9 days, ~3–4 hours/day each)
**Strategy:** AI agents handle scaffolding and boilerplate; human time is reserved for the hard
parts — Kafka pipeline, Quartz wiring, dual-provider webhook validation, state machine logic.

**Scope decisions (final):**

- Segments + DSL engine — CUT (not needed for core flow, can be added as v2)
- Production hardening (Phase 10) — DEFERRED
- Scheduling AND send-now both IN
- Resend + SES dual provider both IN
- CSV import IN

---

## Implementation Progress Checklist

### Backend Progress

- [x] **Day 1 — Foundation (Backend)**
  - [x] Spring Boot project init with Maven & dependencies (`pom.xml`)
  - [x] `docker-compose.yml` (PostgreSQL, Redis, Kafka, Zookeeper, Kafka-UI, Prometheus, Grafana)
  - [x] Spring Data JPA / Hibernate configuration in `application.yml` (using schema auto-creation in place of Flyway per user decision)
- [x] **Day 2 — Auth & Workspace (Backend)**
  - [x] `Workspace`, `WorkspaceMember`, `User`, and `RefreshToken` JPA entities & Spring Data JPA repositories
  - [x] `JwtTokenProvider` (JJWT 0.12.6 HMAC-SHA256), `JwtAuthenticationFilter`, `UserPrincipal`, `CustomUserDetailsService`
  - [x] `SecurityConfig` (stateless JWT, public vs. protected endpoints)
  - [x] `WorkspaceContext` (`ThreadLocal<UUID>`) & `GlobalExceptionHandler` (`ApiResponse`, `ApiErrorResponse`)
  - [x] `AuthService`, `AuthServiceImpl` (with auto-workspace creation on registration) & `AuthController`
  - [x] `WorkspaceService`, `WorkspaceServiceImpl` & `WorkspaceController`
  - [x] Scalar OpenAPI UI setup (`springdoc-openapi-starter-webmvc-scalar` 3.0.2 at `/api-docs`) with JWT security scheme
- [x] **Day 3 — Contacts (Backend)**
  - [x] `Contact` & `ImportJob` JPA entities and repositories
  - [x] `ContactService` & `ContactController` (CRUD, filtering, search)
  - [x] `ContactImportService` (`@Async` CSV chunked import with OpenCSV & progress tracking)
- [x] **Day 4 — Lists & Templates (Backend)**
  - [x] `ContactList` entity, repository, service, and controller
  - [x] `Template` entity, Freemarker `StringTemplateLoader` implementation, render preview endpoint
- [ ] **Day 5 — Campaign Scheduling & Engine (Backend)**
  - [ ] `Campaign` & `CampaignSendJob` entities, repository, service, and controller
  - [ ] Quartz Scheduler integration (`CampaignQuartzJob`, trigger scheduling, immediate send)
- [ ] **Day 6 — Sending Pipeline & Providers (Backend)**
  - [ ] Kafka topics, producer (`EmailSendProducer`), and batch consumer (`EmailSendConsumer`)
  - [ ] Resend & SES email provider implementations (`EmailSender` strategy interface)
  - [ ] Rate-limiting & idempotency checks
- [ ] **Day 7 — Tracking Pixels & Webhooks (Backend)**
  - [ ] Public `/t/o/{token}` open pixel & `/t/c/{token}` click redirect endpoints
  - [ ] Signature-validated webhook endpoints for Resend and AWS SES bounce/complaint handling
- [ ] **Day 8 — Analytics & Outbox (Backend)**
  - [ ] `EmailEvent` repository & analytics queries (KPI rates, time-series bucketing)
  - [ ] Transactional Outbox pattern for event publishing
- [ ] **Day 9 — Integration & Polish (Backend)**
  - [ ] End-to-end backend verification and performance tuning

### Frontend Progress

- [x] **Day 1 — Foundation (Frontend)** (Vite + React 18 + TS, Tailwind, Shadcn/ui, AppShell skeleton)
- [x] **Day 2 — Auth (Frontend)** (Login/Register pages, ProtectedRoute, Axios JWT interceptors)
- [x] **Day 3 — Contacts (Frontend)** (Contact list table, filters, CSV upload modal, progress bar)
- [x] **Day 4 — Lists & Templates (Frontend)** (List management, Template editor & preview)
- [x] **Day 5 — Campaigns (Frontend)** (4-step Campaign Creation Wizard, Quartz scheduler date picker)
- [x] **Day 6 — Dashboard & Overview (Frontend)** (Dashboard KPI cards, recent campaigns, charts)
- [x] **Day 7–8 — Analytics & Detail View (Frontend)** (Campaign detail report, open/click charts, recipient table)
- [ ] **Day 9 — Polish & E2E Testing (Frontend)** (End-to-end browser walkthroughs and UX polish)

---

## Tech Stack

| Layer              | Technology                                                  |
| ------------------ | ----------------------------------------------------------- |
| Backend            | Spring Boot 3.x + Java 21, Maven                            |
| Frontend           | React 18 + TypeScript, Vite                                 |
| Primary DB         | PostgreSQL 16                                               |
| Cache / Rate Limit | Redis 7.2                                                   |
| Message Broker     | Apache Kafka (Confluent 7.6 images)                         |
| Auth               | JWT (JJWT 0.12) + Spring Security                           |
| Scheduling         | Quartz Scheduler with JDBC job store                        |
| DB Migrations      | Flyway                                                      |
| Email Providers    | Resend + AWS SES (strategy pattern, switchable via config)  |
| Template Engine    | Freemarker (`StringTemplateLoader` for DB-stored templates) |
| Deployment         | Docker Compose                                              |
| Observability      | Micrometer + Prometheus + Grafana                           |

---

## Project Structure

```
email-campaign/
├── backend/
│   ├── src/main/java/com/emailcampaign/
│   │   ├── config/           # Security, Kafka, Redis, Quartz, Freemarker, OpenAPI
│   │   ├── security/         # JwtTokenProvider, JwtAuthenticationFilter, UserPrincipal
│   │   ├── domain/           # JPA entities + enums
│   │   ├── repository/       # Spring Data JPA repos
│   │   ├── service/          # Business logic (auth, contact, list, campaign, sending, tracking, analytics, outbox)
│   │   ├── kafka/            # Producers, consumers, message models
│   │   ├── scheduler/        # Quartz Job implementations
│   │   ├── web/              # Controllers, DTOs (request/response), MapStruct mappers, exception handler
│   │   └── util/             # TokenGenerator, IdempotencyKeyGenerator, WorkspaceContext
│   └── src/main/resources/
│       ├── application.yml
│       ├── application-docker.yml
│       └── db/migration/     # V001–V008 Flyway SQL files
├── frontend/
│   └── src/
│       ├── api/              # Axios client + per-resource API modules
│       ├── hooks/            # TanStack Query hooks
│       ├── store/            # Zustand (authStore, uiStore)
│       ├── pages/            # auth, dashboard, contacts, lists, templates, campaigns, settings
│       └── components/       # layout, contacts, templates, campaigns, analytics, import, shared
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── prometheus.yml
│   └── grafana/provisioning/
└── docs/
    ├── api.http              # JetBrains HTTP client test files
    └── adr/                  # Architecture Decision Records
```

---

## Database Schema

All tables use UUIDs (`gen_random_uuid()`), `timestamptz`, composite indexes on `(workspace_id, <lookup_col>)`, and Flyway migrations.

**Core tables:**

| Table                           | Key Columns                                                                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `workspaces`                    | workspace_id, name, slug, plan, daily_send_limit                                                                              |
| `users`                         | user_id, workspace_id, email, password_hash, role (ADMIN                                                                      | MARKETER)                            |
| `refresh_tokens`                | token_id, user_id, token_hash, expires_at                                                                                     |
| `contacts`                      | contact_id, workspace_id, email, first/last name, status (active                                                              | unsubscribed                         | bounced              | cleaned), custom_fields JSONB, tags text[] |
| `lists`                         | list_id, workspace_id, name, contact_count                                                                                    |
| `list_contacts`                 | (list_id, contact_id) PK, added_at                                                                                            |
| `templates`                     | template_id, workspace_id, name, subject, html_content (Freemarker), text_content, variables JSONB                            |
| `campaigns`                     | campaign_id, workspace_id, name, status, template_id, from_name/email, target_list_id, scheduled_at, settings JSONB           |
| `campaign_contacts`             | (campaign_id, contact_id) PK, idempotency_key UNIQUE, status (pending                                                         | sent                                 | delivered            | failed                                     | bounced), provider_message_id |
| `tracking_tokens`               | token (PK, URL-safe base64), token_type (open                                                                                 | click), campaign_id, contact_id, url |
| `tracking_events`               | event_id, workspace_id, campaign_id, contact_id, event_type (sent                                                             | delivered                            | opened               | clicked                                    | bounced                       | complained | unsubscribed), event_data JSONB, provider_event_id (dedup) |
| `campaign_analytics`            | campaign_id (PK), total_sent/delivered/opened/clicked/bounced/unsubscribed, unique_opens/clicks, hard/soft_bounces            |
| `campaign_analytics_timeseries` | (campaign_id, bucket, event_type) PK, count — hourly buckets via `date_trunc('hour', ...)`                                    |
| `outbox_events`                 | event_id, aggregate_type/id, event_type, payload JSONB, topic, status (pending                                                | published                            | failed), retry_count |
| `import_jobs`                   | import_job_id, workspace_id, list_id, file_name, status, total_rows, processed_rows, success/error_count, error_details JSONB |
| `quartz_*`                      | Standard 11-table Quartz JDBC schema (V008 migration)                                                                         |

---

## API Design

**Base:** `/api/v1` — all endpoints require `Authorization: Bearer <jwt>` except `/auth/`**, `/t/**`, `/webhooks/**`.
`workspace_id` is always derived from JWT claims, never from URL.

### Auth — `/api/v1/auth`

- `POST /register` — create workspace + admin user → returns access + refresh tokens
- `POST /login` → tokens
- `POST /refresh`, `POST /logout`, `GET /me`

### Contacts — `/api/v1/contacts`

- `GET /contacts` — paginated, filterable by status/tags/search/listId
- `POST|GET|PUT|DELETE /contacts`, `POST /contacts/{id}/unsubscribe`
- `POST /contacts/import` — upload CSV (multipart) → `{ importJobId }`
- `GET /contacts/import/{jobId}` — poll progress (reads from Redis first)

### Lists — `/api/v1/lists`

- Full CRUD + `GET /lists/{id}/contacts`, bulk add/remove contacts

### Templates — `/api/v1/templates`

- Full CRUD + `POST /templates/{id}/preview` (renders Freemarker with sample vars) + duplicate

### Campaigns — `/api/v1/campaigns`

- `GET|POST /campaigns` — list (with status filter) / create draft
- `GET|PUT|DELETE /campaigns/{id}` — get / update (draft only) / cancel
- `POST /campaigns/{id}/schedule` — `{ scheduledAt }` → creates Quartz trigger
- `POST /campaigns/{id}/send-now` — immediate send
- `POST /campaigns/{id}/pause`, `POST /campaigns/{id}/resume`
- `GET /campaigns/{id}/analytics` — rates + counts
- `GET /campaigns/{id}/analytics/timeseries` — hourly/daily bucketed events
- `GET /campaigns/{id}/contacts` — per-recipient send status (paginated)

### Tracking — `/t` (no auth, minimal-overhead servlet)

- `GET /t/o/{token}` — open pixel → return 1x1 transparent GIF + publish open event
- `GET /t/c/{token}` — click redirect → 302 to original URL + publish click event

### Webhooks — `/api/v1/webhooks` (signature-validated, no JWT)

- `POST /webhooks/resend/events` — validate `Resend-Signature` header (HMAC-SHA256)
- `POST /webhooks/ses/events` — validate SNS signature, handle Bounce/Complaint/Delivery

### Admin — `/api/v1/admin` (ADMIN role only)

- Workspace management, system health (Kafka/Redis/DB), send metrics

### Standard response envelope:

```json
{ "data": [...], "pagination": { "page":0, "size":20, "totalElements":500, "totalPages":25 } }
```

```json
{ "error": { "code": "CAMPAIGN_NOT_FOUND", "message": "...", "traceId": "abc" } }
```

---

## Kafka Topics

| Topic                      | Partitions | Key          | Consumer Group             | Purpose                                                     |
| -------------------------- | ---------- | ------------ | -------------------------- | ----------------------------------------------------------- |
| `email.campaign.scheduled` | 4          | workspace_id | `campaign-batch-generator` | Campaign transitions to SENDING → batch generator kicks off |
| `email.send.batches`       | 12         | workspace_id | `email-sender-pool`        | 250-contact batches → rate-limited provider calls           |
| `email.tracking.events`    | 8          | campaign_id  | `analytics-aggregator`     | All open/click/bounce events → analytics upserts            |
| `email.contact.events`     | 4          | workspace_id | `contact-status-updater`   | Hard bounce/unsubscribe → update contact.status             |

**Outbox relay** (`OutboxRelayService`): polls `outbox_events WHERE status='pending' LIMIT 100` every 500ms → publishes to correct topic → marks `published`. No separate relay topic needed.

**Dead Letter Topics**: `@RetryableTopic` on `email.send.batches` (3 retries, exponential backoff) → DLT `email.send.batches.DLT`.

---

## Key Engineering Patterns

### 1. Transactional Outbox

Campaign status DB update + outbox event write happen in one `@Transactional` call. `OutboxRelayService` polls and publishes to Kafka separately. Avoids dual-write inconsistency between DB and Kafka.

### 2. Idempotency

`campaign_contacts.idempotency_key = campaign_id::contact_id` with UNIQUE constraint. `EmailSenderConsumer` checks this before calling provider. Resend uses `X-Entity-Ref-Id`; SES uses `ClientToken`.

### 3. Redis Token Bucket Rate Limiter

Lua script on Redis key `rate_limit:{workspace_id}` atomically checks and decrements tokens. `EmailSenderConsumer` calls `RateLimiterService.tryConsume(workspaceId, 1)` per send; parks on `false` with `@RetryableTopic` backoff.

### 4. Quartz JDBC Scheduling

`CampaignSchedulerService` registers `CampaignSendJob` with Quartz using JDBC job store. DB-level pessimistic locking (`SELECT FOR UPDATE` on `qrtz_locks`) ensures only one node fires each trigger in a cluster. Misfire instruction: `MISFIRE_INSTRUCTION_FIRE_NOW`.

### 5. Template Rendering + Link Rewriting

`TemplateRenderer` uses Freemarker `StringTemplateLoader` to render DB-stored templates. Before sending, Jsoup parses `<a href="...">` tags — each URL replaced with `/t/c/{token}` and a `TrackingToken` row is written. Open pixel `<img src="/t/o/{token}">` injected before `</body>`.

### 6. CSV Import (Async)

`ContactImportService.@Async` method: reads with OpenCSV in 500-row chunks, upserts via `saveAll()` with `ON CONFLICT DO UPDATE`, updates both `ImportJob` DB row and Redis hash `import:{jobId}:progress` every chunk. Progress endpoint reads Redis first.

---

## Spring Libraries (key decisions)

| Concern                     | Library                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| Object mapping              | MapStruct 1.5 — compile-time, zero reflection                                                    |
| JWT                         | JJWT 0.12                                                                                        |
| Redis client                | Lettuce (bundled with Spring Data Redis)                                                         |
| Kafka                       | Spring Kafka 3.x — `@KafkaListener`, `KafkaTemplate`, `@RetryableTopic`                          |
| CSV                         | OpenCSV 5.x                                                                                      |
| HTML parsing (link rewrite) | Jsoup                                                                                            |
| Circuit breaker             | Resilience4j `@CircuitBreaker` on provider calls                                                 |
| OpenAPI                     | SpringDoc OpenAPI 2.x                                                                            |
| Observability               | Micrometer + Prometheus — custom `email.sends.total` counter (tags: workspace, provider, status) |

---

## Frontend Stack

- Vite + React 18 + TypeScript
- **TanStack Query v5** — all server state; mutations invalidate related queries
- **Zustand** — authStore (user, workspace, tokens), uiStore (sidebar, notifications)
- **Axios** — interceptor: auto-attach JWT; on 401 → refresh transparently → logout on failure
- **React Hook Form + Zod** — all forms
- **Shadcn/ui + Tailwind** — component library
- **Recharts** — analytics charts (LineChart for time-series, funnel for delivery flow)
- **Monaco Editor** — HTML template editor
- **TanStack Table v8** — server-paginated data tables
- **React-dropzone** — CSV upload

**Key component patterns:**

- `CampaignWizard`: multi-step with `useFormContext` passing accumulated state across steps.
- `useImportJob` hook: polls `GET /contacts/import/{jobId}` via `refetchInterval: 2000` until `status === 'completed'`.
- Template editor: Monaco on left, sandboxed `<iframe>` preview on right, refreshed on 600ms debounce.

---

## Docker Compose Services

| Service    | Image                              | Port |
| ---------- | ---------------------------------- | ---- |
| postgres   | postgres:16-alpine                 | 5432 |
| redis      | redis:7.2-alpine                   | 6379 |
| zookeeper  | confluentinc/cp-zookeeper:7.6.0    | 2181 |
| kafka      | confluentinc/cp-kafka:7.6.0        | 9092 |
| kafka-init | cp-kafka (one-shot topic creation) | —    |
| kafka-ui   | provectuslabs/kafka-ui             | 8090 |
| backend    | multi-stage JDK21 build            | 8080 |
| frontend   | Vite build → nginx                 | 3000 |
| prometheus | prom/prometheus                    | 9090 |
| grafana    | grafana/grafana                    | 3001 |

Backend env vars: `SPRING_DATASOURCE_URL`, `SPRING_DATA_REDIS_*`, `SPRING_KAFKA_BOOTSTRAP_SERVERS`, `JWT_SECRET`, `APP_EMAIL_PROVIDER` (resend|ses), `RESEND_API_KEY`, `AWS_*`.

---

## 9-Day Implementation Plan

> **Person A** = Backend lead | **Person B** = Frontend lead
> AI agents handle all scaffolding, boilerplate, and CRUD. Human time = complex logic only.

---

### Day 1 — Aug 5 | Foundation

**Person A (Backend):**

- Spring Boot project init (Spring Initializr) with all dependencies declared in `pom.xml`
- `docker-compose.yml` — all 10 services with health checks and startup ordering
- Flyway migrations V001–V008 (all tables + Quartz 11-table schema)
- `application.yml` + `application-docker.yml`

**Person B (Frontend):**

- Vite + React 18 + TypeScript project init
- Tailwind + Shadcn/ui setup
- Folder structure scaffolded (`api/`, `hooks/`, `store/`, `pages/`, `components/`)
- Axios client skeleton + TanStack Query client + Zustand stores (authStore, uiStore)
- AppShell skeleton (Sidebar + TopBar, placeholder routes)

**Deliverable:** `docker compose up -d` — all services healthy. Frontend dev server running.

---

### Day 2 — Aug 6 | Auth

**Person A (Backend):**

- `Workspace`, `User`, `RefreshToken` entities
- `JwtTokenProvider`, `JwtAuthenticationFilter`, `UserPrincipal`
- `SecurityConfig`, `AuthController` (register, login, refresh, logout, me)
- `GlobalExceptionHandler`, `WorkspaceContext` ThreadLocal

**Person B (Frontend):**

- `LoginPage`, `RegisterPage` — React Hook Form + Zod validation
- `ProtectedRoute`, auth API module (`api/auth.ts`), auth hooks
- Axios interceptor: auto-attach JWT, transparent refresh on 401, logout on failure
- `DashboardPage` stub (hardcoded KPI cards for now)

**Deliverable:** Register → login → dashboard flow works end-to-end.

---

### Day 3 — Aug 7 | Contacts

**Person A (Backend):**

- `Contact` entity with `@JdbcTypeCode(SqlTypes.JSON)` for `custom_fields` and `@JdbcTypeCode(SqlTypes.ARRAY)` for `tags`
- `ContactRepository` with `Specification`-based filtering (status, tags, search, listId)
- `ContactService` — CRUD + soft delete + unsubscribe
- `ContactController` — all endpoints
- `ImportJob` entity, `ContactImportService` (`@Async`, OpenCSV 500-row chunks, `ON CONFLICT DO UPDATE`, Redis progress hash)

**Person B (Frontend):**

- `ContactsPage` — `ContactTable` (TanStack Table, server-paginated), `ContactFilters`, `ContactForm` modal
- `ImportPage` — react-dropzone CSV upload → progress bar polling `useImportJob` hook
- contacts + import API modules and TanStack Query hooks

**Deliverable:** All `/contacts` endpoints working; CSV import with live progress bar.

---

### Day 4 — Aug 8 | Lists + Templates

**Person A (Backend):**

- `AudienceList` + `ListContact` entities, `AudienceListService`, `ListController` (CRUD + bulk add/remove contacts)
- `Template` entity, `TemplateRenderer` (Freemarker `StringTemplateLoader` + Jsoup link rewrite + open pixel inject)
- `TemplateController` (CRUD + preview + duplicate)

**Person B (Frontend):**

- `ListsPage` + `ListDetailPage` (contacts sub-table, add/remove contacts)
- `TemplateEditorPage` — Monaco editor (left) + sandboxed iframe preview (right, 600ms debounce)
- lists + templates API modules and hooks

**Deliverable:** Lists manageable; template preview renders Freemarker output live.

---

### Day 5 — Aug 9 | Campaign Lifecycle + Quartz

**Person A (Backend):**

- `Campaign` entity + status enum (DRAFT → SCHEDULED → SENDING → PAUSED → COMPLETED → CANCELLED)
- `CampaignService` — state machine validation (guards illegal transitions)
- `CampaignSchedulerService` — registers `CampaignSendJob` with Quartz JDBC job store; misfire `MISFIRE_INSTRUCTION_FIRE_NOW`
- `CampaignController` — all endpoints (create, update, schedule, send-now, pause, resume, cancel, contacts list)

**Person B (Frontend):**

- `CampaignsPage` — table with status badges, action buttons (send now / schedule / pause / cancel)
- `CampaignBuilderPage` — multi-step wizard: (1) Details → (2) Audience (pick list) → (3) Template → (4) Schedule / Send Now → (5) Review & Confirm
- campaigns API module and hooks

**Deliverable:** Campaign can be created, scheduled, or sent immediately via the wizard.

---

### Day 6 — Aug 10 | Kafka Pipeline Part 1 — Outbox + Batch Generator

**Person A (Backend):**

- `OutboxRelayService` — `@Scheduled` 500ms poll, `SELECT ... FOR UPDATE SKIP LOCKED` on `outbox_events`, publishes to Kafka, marks `published`; handles Kafka unavailability with exponential backoff
- `CampaignSendOrchestrator.initiateSend()` — single `@Transactional`: set campaign status=SENDING + write outbox event
- `BatchGeneratorConsumer` — `@KafkaListener(email.campaign.scheduled)`: pages all list contacts 250/batch, writes `campaign_contacts` rows, publishes batches to `email.send.batches`

**Person B (Frontend):**

- `CampaignDetailPage` — status display, timeline of state transitions
- `CampaignAnalyticsPage` skeleton — KPI cards wired to real `/analytics` endpoint (data still zeros until pipeline runs)
- per-recipient contacts table (paginated, shows pending/sent/failed status)

**Deliverable:** Triggering a campaign populates `campaign_contacts` and publishes batches to Kafka (visible in Kafka UI).

---

### Day 7 — Aug 11 | Kafka Pipeline Part 2 — Sender + Tracking

**Person A (Backend):**

- `EmailProvider` interface + `ResendEmailProvider` (`X-Entity-Ref-Id` idempotency) + `AwsSesEmailProvider` (`ClientToken`) + `EmailProviderFactory` (`@ConditionalOnProperty`)
- `RateLimiterService` — Redis Lua token bucket on `rate_limit:{workspace_id}`
- `EmailSenderConsumer` — `@KafkaListener(email.send.batches, concurrency=12)`: idempotency check → rate limit → render template → send → update `campaign_contacts.status` → publish to `email.tracking.events`
- `@RetryableTopic` (3 retries, exponential backoff) + DLT handler
- `TrackingController` — open pixel (returns 1×1 transparent GIF) + click redirect (302)

**Person B (Frontend):**

- `DashboardPage` — real 30-day workspace KPI cards (total sent, open rate, click rate, bounce rate)
- Notifications toast when campaign transitions to SENDING/COMPLETED
- polish campaign wizard UX

**Deliverable:** Emails delivered to inbox; open pixel fires; click redirect works. Kafka UI shows messages flowing through all topics.

---

### Day 8 — Aug 12 | Webhooks + Analytics

**Person A (Backend):**

- `WebhookController` — no JWT; signature-validated endpoints for both providers
- `WebhookProcessorService`:
  - Resend: validate `Resend-Signature` HMAC-SHA256; parse delivered/bounced/complained events
  - SES: validate SNS signature; parse Bounce/Complaint/Delivery notifications
- `AnalyticsConsumer` — `@KafkaListener(email.tracking.events)`: `INSERT ... ON CONFLICT DO UPDATE` on `campaign_analytics` + `campaign_analytics_timeseries` (hourly buckets)
- `ContactEventConsumer` — hard bounce/unsubscribe → update `contacts.status`
- `AnalyticsController` — campaign analytics + timeseries + workspace 30-day summary

**Person B (Frontend):**

- `CampaignAnalyticsPage` complete — KPI cards + `FunnelChart` (sent→delivered→opened→clicked) + `TimeSeriesChart` (hourly/daily with range picker, Recharts)
- analytics API module and hooks

**Deliverable:** Webhooks update `campaign_contacts.status`; analytics populate in real time; charts show real data.

---

### Day 9 — Aug 13 | Integration + Polish

**Both:**

- End-to-end test: register → import CSV → create list → create template → build campaign → schedule → Quartz fires → emails deliver → open pixel fires → webhook updates status → analytics dashboard updates
- Docker Compose full stack validation (`docker compose up -d`, all services healthy)
- `docs/api.http` — JetBrains HTTP client file covering all endpoints
- `.env.example` with all required env vars documented
- UI polish: loading states, error boundaries, empty states
- Fix integration bugs surfaced by full-stack testing

**Deliverable:** Complete MVP running in Docker. Full campaign lifecycle verified end-to-end.

---

## Critical Files (highest risk, human attention required)

1. `backend/.../kafka/consumer/EmailSenderConsumer.java` — coordinates idempotency check → rate limit → render → provider call → persistence; must be correct with `@RetryableTopic`
2. `backend/.../service/outbox/OutboxRelayService.java` — must handle Kafka unavailability gracefully; `FOR UPDATE SKIP LOCKED` prevents duplicate publishing
3. `backend/.../kafka/consumer/BatchGeneratorConsumer.java` — correct pagination prevents duplicate or missing batches; offset commit timing matters
4. `backend/.../web/WebhookProcessorService.java` — dual-provider signature validation; wrong implementation = security hole
5. `backend/.../service/template/TemplateRenderer.java` — Jsoup link rewrite + pixel inject must not corrupt HTML
6. `docker/docker-compose.yml` — health checks and `depends_on` ordering; backend must not start before Kafka + Postgres are ready

---

## Verification Checklist

1. `docker compose up -d` — all 10 services healthy
2. `POST /auth/register` + `POST /auth/login` via `docs/api.http`
3. `POST /contacts/import` with 10K-row CSV → poll progress to 100% completion
4. Create campaign targeting a list → `POST /campaigns/{id}/schedule` → wait for Quartz fire → verify `campaign_contacts` rows populate in DB
5. `POST /campaigns/{id}/send-now` → verify messages appear in Kafka UI (`email.send.batches` topic)
6. Receive test email with tracking pixel → `GET /t/o/{token}` → verify `tracking_events` row inserted + `campaign_analytics.total_opened` increments
7. Send test webhook payload to `/webhooks/resend/events` → verify `campaign_contacts.status` updates to `delivered`
8. Send test bounce payload to `/webhooks/ses/events` → verify `contacts.status` updates to `bounced`
9. `GET /campaigns/{id}/analytics` → open rate, click rate, bounce rate reflect actual events
10. Frontend: full campaign creation wizard end-to-end in browser, analytics charts show real data
