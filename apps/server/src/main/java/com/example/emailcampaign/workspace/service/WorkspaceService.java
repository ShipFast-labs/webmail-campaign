package com.example.emailcampaign.workspace.service;

import com.example.emailcampaign.workspace.domain.Workspace;
import com.example.emailcampaign.workspace.domain.WorkspaceRole;
import com.example.emailcampaign.workspace.dto.CreateWorkspaceRequest;
import com.example.emailcampaign.workspace.dto.WorkspaceResponse;

import java.util.List;
import java.util.UUID;

public interface WorkspaceService {
    Workspace createWorkspace(String name, UUID ownerId);
    WorkspaceResponse createWorkspace(CreateWorkspaceRequest request, UUID ownerId);
    List<WorkspaceResponse> getUserWorkspaces(UUID userId);
    WorkspaceResponse getWorkspaceById(UUID workspaceId, UUID userId);
    boolean isMember(UUID workspaceId, UUID userId);
    WorkspaceRole getMemberRole(UUID workspaceId, UUID userId);
}
