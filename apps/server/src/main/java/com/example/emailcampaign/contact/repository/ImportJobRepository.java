package com.example.emailcampaign.contact.repository;

import com.example.emailcampaign.contact.domain.ImportJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ImportJobRepository extends JpaRepository<ImportJob, UUID> {

    Optional<ImportJob> findByIdAndWorkspace_Id(UUID id, UUID workspaceId);
}
