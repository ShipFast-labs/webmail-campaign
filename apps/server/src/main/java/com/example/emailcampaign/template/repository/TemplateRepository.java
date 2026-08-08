package com.example.emailcampaign.template.repository;

import com.example.emailcampaign.template.domain.Template;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TemplateRepository extends JpaRepository<Template, UUID> {

    List<Template> findAllByWorkspace_Id(UUID workspaceId);

    Optional<Template> findByIdAndWorkspace_Id(UUID id, UUID workspaceId);
}
