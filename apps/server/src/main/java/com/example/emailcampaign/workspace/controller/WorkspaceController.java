package com.example.emailcampaign.workspace.controller;

import com.example.emailcampaign.auth.security.UserPrincipal;
import com.example.emailcampaign.common.api.ApiResponse;
import com.example.emailcampaign.workspace.domain.Workspace;
import com.example.emailcampaign.workspace.domain.WorkspaceRole;
import com.example.emailcampaign.workspace.dto.CreateWorkspaceRequest;
import com.example.emailcampaign.workspace.dto.WorkspaceResponse;
import com.example.emailcampaign.workspace.service.WorkspaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workspaces")
@RequiredArgsConstructor
@Tag(name = "Workspace & Multi-Tenancy", description = "Endpoints for creating workspaces and querying workspace memberships")
@SecurityRequirement(name = "bearerAuth")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @GetMapping
    @Operation(summary = "List user workspaces", description = "Returns all workspaces where the authenticated JWT user is a member.")
    public ResponseEntity<ApiResponse<List<WorkspaceResponse>>> listWorkspaces(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<WorkspaceResponse> workspaces = workspaceService.getUserWorkspaces(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(workspaces));
    }

    @PostMapping
    @Operation(summary = "Create workspace", description = "Creates a new workspace and assigns the current authenticated user as ADMIN.")
    public ResponseEntity<ApiResponse<WorkspaceResponse>> createWorkspace(
            @Valid @RequestBody CreateWorkspaceRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        Workspace workspace = workspaceService.createWorkspace(
                request.getName(),
                principal.getId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(WorkspaceResponse.from(workspace, WorkspaceRole.ADMIN)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get workspace details", description = "Returns workspace details if the authenticated JWT user is a member.")
    @Parameter(name = "X-Workspace-Id", description = "Optional target workspace ID header", in = ParameterIn.HEADER)
    public ResponseEntity<ApiResponse<WorkspaceResponse>> getWorkspace(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        WorkspaceResponse workspace = workspaceService.getWorkspaceById(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(workspace));
    }
}
