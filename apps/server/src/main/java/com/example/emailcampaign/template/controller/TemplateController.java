package com.example.emailcampaign.template.controller;

import com.example.emailcampaign.common.api.ApiResponse;
import com.example.emailcampaign.common.context.WorkspaceContext;
import com.example.emailcampaign.template.dto.*;
import com.example.emailcampaign.template.service.TemplateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/templates")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Templates", description = "Email template management with Freemarker variable rendering")
public class TemplateController {

    private final TemplateService templateService;

    @GetMapping
    @Operation(summary = "Get all templates", description = "Returns all email templates in the current workspace")
    public ResponseEntity<ApiResponse<List<TemplateResponse>>> getTemplates() {
        return ResponseEntity.ok(ApiResponse.ok(templateService.getTemplates(workspaceId())));
    }

    @PostMapping
    @Operation(summary = "Create template", description = "Creates a new email template with Freemarker markup support")
    public ResponseEntity<ApiResponse<TemplateResponse>> createTemplate(
            @Valid @RequestBody CreateTemplateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(templateService.createTemplate(workspaceId(), request)));
    }

    @GetMapping("/{templateId}")
    @Operation(summary = "Get template", description = "Returns a single template by ID")
    public ResponseEntity<ApiResponse<TemplateResponse>> getTemplate(@PathVariable UUID templateId) {
        return ResponseEntity.ok(ApiResponse.ok(templateService.getTemplate(workspaceId(), templateId)));
    }

    @PutMapping("/{templateId}")
    @Operation(summary = "Update template", description = "Partially updates a template — only provided fields are changed")
    public ResponseEntity<ApiResponse<TemplateResponse>> updateTemplate(
            @PathVariable UUID templateId,
            @Valid @RequestBody UpdateTemplateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(templateService.updateTemplate(workspaceId(), templateId, request)));
    }

    @DeleteMapping("/{templateId}")
    @Operation(summary = "Delete template", description = "Permanently deletes a template")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(@PathVariable UUID templateId) {
        templateService.deleteTemplate(workspaceId(), templateId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PostMapping("/{templateId}/preview")
    @Operation(summary = "Preview template", description = "Renders the template with provided variable values using Freemarker")
    public ResponseEntity<ApiResponse<TemplatePreviewResponse>> previewTemplate(
            @PathVariable UUID templateId,
            @RequestBody TemplatePreviewRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(templateService.previewTemplate(workspaceId(), templateId, request)));
    }

    @PostMapping("/{templateId}/duplicate")
    @Operation(summary = "Duplicate template", description = "Creates a copy of the template prefixed with 'Copy of'")
    public ResponseEntity<ApiResponse<TemplateResponse>> duplicateTemplate(@PathVariable UUID templateId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(templateService.duplicateTemplate(workspaceId(), templateId)));
    }

    private UUID workspaceId() {
        return WorkspaceContext.getCurrentWorkspaceId();
    }
}
