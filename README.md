# NamiSend

NamiSend is an email campaign platform. You can import contacts, build HTML email templates, send campaigns to your lists, and track opens and clicks in real time.

Live at https://namisend.com

## What it does

Send bulk emails to your contacts with personalized content using variables like `{{firstName}}`. Schedule campaigns for a future time or send immediately. Every email gets a unique open pixel and click tracking link per recipient. Analytics show you exactly who opened and clicked.

## Stack

Frontend is React with TanStack Router and Tailwind. Backend is Java Spring Boot. Emails go through Resend. Contacts are uploaded via CSV to S3. The sending pipeline runs through Kafka so large lists don't block the API. Quartz handles scheduled campaigns and persists jobs in Postgres so they survive restarts. Redis handles rate limiting.

## Running locally

You need Postgres, Redis, and Kafka running. The easiest way is Docker.

```sh
docker compose up -d
```

For the backend, copy the example env file and fill in your keys, then start the server.

```sh
cd apps/server
cp .env.example .env
./mvnw spring-boot:run
```

For the frontend:

```sh
bun install
bun dev
```

The app runs on port 5173, the API on port 8080.

## Environment variables

See `apps/server/.env.example` for the full list. The ones you actually need to fill in are the database URL, a JWT secret, Google OAuth credentials, a Resend API key, and AWS credentials for S3.

The frontend only needs one variable: `VITE_API_URL` pointing to the backend.

## API docs

Scalar UI is available at `http://localhost:8080/api-docs` when the server is running.
