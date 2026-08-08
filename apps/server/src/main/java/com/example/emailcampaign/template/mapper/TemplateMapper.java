package com.example.emailcampaign.template.mapper;

import com.example.emailcampaign.template.domain.Template;
import com.example.emailcampaign.template.dto.TemplateResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TemplateMapper {

    @Mapping(source = "workspace.id", target = "workspaceId")
    TemplateResponse toResponse(Template template);
}
