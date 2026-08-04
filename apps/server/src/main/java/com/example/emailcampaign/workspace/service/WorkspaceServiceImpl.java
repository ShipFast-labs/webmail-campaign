package com.example.emailcampaign.workspace.service;

import com.example.emailcampaign.common.exception.ApiException;
import com.example.emailcampaign.workspace.domain.Workspace;
import com.example.emailcampaign.workspace.domain.WorkspaceMember;
import com.example.emailcampaign.workspace.domain.WorkspaceRole;
import com.example.emailcampaign.workspace.dto.CreateWorkspaceRequest;
import com.example.emailcampaign.workspace.dto.WorkspaceResponse;
import com.example.emailcampaign.workspace.repository.WorkspaceMemberRepository;
import com.example.emailcampaign.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    @Override
    @Transactional
    public Workspace createWorkspace(String name, UUID ownerId) {
        Workspace workspace = new Workspace(name, ownerId);
        workspace = workspaceRepository.save(workspace);

        WorkspaceMember member = new WorkspaceMember(workspace.getId(), ownerId, WorkspaceRole.ADMIN);
        workspaceMemberRepository.save(member);

        return workspace;
    }

    @Override
    @Transactional
    public WorkspaceResponse createWorkspace(CreateWorkspaceRequest request, UUID ownerId) {
        Workspace workspace = createWorkspace(request.getName(), ownerId);
        return WorkspaceResponse.from(workspace, WorkspaceRole.ADMIN);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkspaceResponse> getUserWorkspaces(UUID userId) {
        List<WorkspaceMember> members = workspaceMemberRepository.findByUserId(userId);
        return members.stream().map(member -> {
            Workspace ws = workspaceRepository.findById(member.getWorkspaceId())
                    .orElseThrow(() -> ApiException.notFound("WORKSPACE_NOT_FOUND", "Workspace not found: " + member.getWorkspaceId()));
            return WorkspaceResponse.from(ws, member.getRole());
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public WorkspaceResponse getWorkspaceById(UUID workspaceId, UUID userId) {
        WorkspaceMember member = workspaceMemberRepository.findByWorkspaceIdAndUserId(workspaceId, userId)
                .orElseThrow(() -> ApiException.forbidden("WORKSPACE_ACCESS_DENIED", "You are not a member of this workspace"));
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> ApiException.notFound("WORKSPACE_NOT_FOUND", "Workspace not found: " + workspaceId));
        return WorkspaceResponse.from(workspace, member.getRole());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isMember(UUID workspaceId, UUID userId) {
        return workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspaceId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public WorkspaceRole getMemberRole(UUID workspaceId, UUID userId) {
        return workspaceMemberRepository.findByWorkspaceIdAndUserId(workspaceId, userId)
                .map(WorkspaceMember::getRole)
                .orElse(null);
    }
}
