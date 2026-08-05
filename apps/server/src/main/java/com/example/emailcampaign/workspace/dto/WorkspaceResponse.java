package com.example.emailcampaign.workspace.dto;

import com.example.emailcampaign.workspace.domain.Workspace;
import com.example.emailcampaign.workspace.domain.WorkspaceRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceResponse {
    private UUID id;
    private String name;
    private UUID ownerId;
    private WorkspaceRole role;
    private Instant createdAt;
    private Instant updatedAt;

    public static WorkspaceResponse from(Workspace workspace, WorkspaceRole role) {
        return new WorkspaceResponse(
                workspace.getId(),
                workspace.getName(),
                workspace.getOwnerId(),
                role,
                workspace.getCreatedAt(),
                workspace.getUpdatedAt()
        );
    }
}
