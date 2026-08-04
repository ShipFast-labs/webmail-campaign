package com.example.emailcampaign.workspace.repository;

import com.example.emailcampaign.workspace.domain.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {
}
