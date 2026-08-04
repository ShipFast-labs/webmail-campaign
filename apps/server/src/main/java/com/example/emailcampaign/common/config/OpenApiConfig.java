package com.example.emailcampaign.common.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Email Campaign Platform API",
                version = "1.0.0",
                description = "Production-grade, Mailchimp-like email campaign platform backend API. " +
                        "Multi-tenant workspace isolation is supported via JWT Authentication and the optional 'X-Workspace-Id' header.",
                contact = @Contact(name = "Email Campaign Engineering Team")
        ),
        servers = {
                @Server(url = "/", description = "Default Server URL")
        },
        security = {
                @SecurityRequirement(name = "bearerAuth")
        }
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        description = "Enter JWT Access Token to authenticate API requests. " +
                "You can obtain an access token from POST /api/v1/auth/login or POST /api/v1/auth/register."
)
public class OpenApiConfig {
}
