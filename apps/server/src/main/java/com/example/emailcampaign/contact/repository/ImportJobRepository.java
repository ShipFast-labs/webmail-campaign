package com.example.emailcampaign.contact.repository;

import com.example.emailcampaign.contact.domain.ImportJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ImportJobRepository extends JpaRepository<ImportJob, UUID> {

    Optional<ImportJob> findByIdAndWorkspace_Id(UUID id, UUID workspaceId);
}
