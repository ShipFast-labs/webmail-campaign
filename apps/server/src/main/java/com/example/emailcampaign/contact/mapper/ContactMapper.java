package com.example.emailcampaign.contact.mapper;

import com.example.emailcampaign.contact.domain.Contact;
import com.example.emailcampaign.contact.domain.ImportJob;
import com.example.emailcampaign.contact.dto.ContactResponse;
import com.example.emailcampaign.contact.dto.ImportProgressResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ContactMapper {

    @Mapping(source = "workspace.id", target = "workspaceId")
    @Mapping(source = "status", target = "status")
    ContactResponse toResponse(Contact contact);

    @Mapping(source = "id", target = "jobId")
    @Mapping(source = "status", target = "status")
    ImportProgressResponse toImportProgressResponse(ImportJob job);
}
