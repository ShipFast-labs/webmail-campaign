package com.example.emailcampaign.list.service;

import com.example.emailcampaign.list.dto.*;

import java.util.List;
import java.util.UUID;

public interface AudienceListService {

    List<AudienceListResponse> getLists(UUID workspaceId);

    AudienceListResponse getList(UUID workspaceId, UUID listId);

    AudienceListResponse createList(UUID workspaceId, CreateListRequest request);

    AudienceListResponse updateList(UUID workspaceId, UUID listId, UpdateListRequest request);

    void deleteList(UUID workspaceId, UUID listId);

    List<ListContactResponse> getListContacts(UUID workspaceId, UUID listId);

    void addContacts(UUID workspaceId, UUID listId, BulkContactRequest request);

    void removeContact(UUID workspaceId, UUID listId, UUID contactId);
}
