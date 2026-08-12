package com.example.emailcampaign.campaign.repository;

import com.example.emailcampaign.campaign.domain.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, UUID> {

    List<Campaign> findAllByWorkspace_IdOrderByCreatedAtDesc(UUID workspaceId);

    Optional<Campaign> findByIdAndWorkspace_Id(UUID id, UUID workspaceId);
}
