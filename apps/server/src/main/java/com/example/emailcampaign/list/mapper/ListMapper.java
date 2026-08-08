package com.example.emailcampaign.list.mapper;

import com.example.emailcampaign.list.domain.AudienceList;
import com.example.emailcampaign.list.domain.ListContact;
import com.example.emailcampaign.list.dto.AudienceListResponse;
import com.example.emailcampaign.list.dto.ListContactResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ListMapper {

    @Mapping(source = "workspace.id", target = "workspaceId")
    AudienceListResponse toResponse(AudienceList list);

    @Mapping(source = "contact.id", target = "contactId")
    @Mapping(source = "contact.email", target = "email")
    @Mapping(source = "contact.firstName", target = "firstName")
    @Mapping(source = "contact.lastName", target = "lastName")
    @Mapping(source = "contact.status", target = "status")
    ListContactResponse toContactResponse(ListContact listContact);
}
