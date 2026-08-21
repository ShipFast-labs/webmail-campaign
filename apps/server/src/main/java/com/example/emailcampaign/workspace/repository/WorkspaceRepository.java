package com.example.emailcampaign.workspace.repository;

import com.example.emailcampaign.workspace.domain.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {

    @Query("SELECT w.ownerId FROM Workspace w WHERE w.id = :workspaceId")
    UUID findOwnerIdById(@Param("workspaceId") UUID workspaceId);
}
