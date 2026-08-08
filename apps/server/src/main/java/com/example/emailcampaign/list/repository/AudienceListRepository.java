package com.example.emailcampaign.list.repository;

import com.example.emailcampaign.list.domain.AudienceList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AudienceListRepository extends JpaRepository<AudienceList, UUID> {

    List<AudienceList> findAllByWorkspace_Id(UUID workspaceId);

    Optional<AudienceList> findByIdAndWorkspace_Id(UUID id, UUID workspaceId);
}
