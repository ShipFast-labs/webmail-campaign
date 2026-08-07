package com.example.emailcampaign.workspace.domain;

import com.example.emailcampaign.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "workspace_members",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"workspace_id", "user_id"})
        }
)
public class WorkspaceMember extends BaseEntity {

    @Column(name = "workspace_id", nullable = false)
    private UUID workspaceId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkspaceRole role;
    
    
}
