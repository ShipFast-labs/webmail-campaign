package com.example.emailcampaign.campaign.mapper;

import com.example.emailcampaign.campaign.domain.Campaign;
import com.example.emailcampaign.campaign.dto.CampaignResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CampaignMapper {

    @Mapping(source = "workspace.id",    target = "workspaceId")
    @Mapping(source = "template.id",     target = "templateId")
    @Mapping(source = "targetList.id",   target = "targetListId")
    CampaignResponse toResponse(Campaign campaign);
}
