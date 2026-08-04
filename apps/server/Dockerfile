FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

COPY . .

RUN chmod +x ./mvnw \
    && ./mvnw -DskipTests package \
    && mkdir -p /out \
    && cp target/*.jar /out/app.jar

FROM eclipse-temurin:21-jre AS app

WORKDIR /app

COPY --from=builder /out/app.jar /app/app.jar

ENV PORT=8080

EXPOSE 8080

CMD ["java", "-jar", "/app/app.jar"]
