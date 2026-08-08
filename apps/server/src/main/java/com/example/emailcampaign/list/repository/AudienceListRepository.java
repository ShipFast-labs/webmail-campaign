package com.example.emailcampaign.list.repository;

import com.example.emailcampaign.list.domain.AudienceList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AudienceListRepository extends JpaRepository<AudienceList, UUID> {

    List<AudienceList> findAllByWorkspace_Id(UUID workspaceId);

    Optional<AudienceList> findByIdAndWorkspace_Id(UUID id, UUID workspaceId);
}
