FROM oven/bun:1.3.13 AS builder
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
ARG VITE_API_URL=http://localhost:8085
ENV VITE_API_URL=${VITE_API_URL}
WORKDIR /app/apps/web
RUN bun run build

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
