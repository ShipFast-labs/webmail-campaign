package com.example.emailcampaign.common.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.responses.ApiResponse;

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

    @Bean
    public OpenApiCustomizer oauth2OpenApiCustomizer() {
        return openApi -> {
            openApi.getPaths().addPathItem("/oauth2/authorization/google", new PathItem()
                    .get(new io.swagger.v3.oas.models.Operation()
                            .summary("Login with Google OAuth2")
                            .description("Redirects the browser to Google's OAuth2 consent screen. Upon success, redirects back to the frontend with accessToken and refreshToken in the URL.")
                            .addTagsItem("Authentication & Identity")
                            .responses(new ApiResponses()
                                    .addApiResponse("302", new ApiResponse().description("Redirects to Google")))));
        };
    }
}
