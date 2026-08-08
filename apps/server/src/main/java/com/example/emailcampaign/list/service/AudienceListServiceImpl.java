package com.example.emailcampaign.list.service;

import com.example.emailcampaign.common.exception.ApiException;
import com.example.emailcampaign.contact.domain.Contact;
import com.example.emailcampaign.contact.repository.ContactRepository;
import com.example.emailcampaign.list.domain.AudienceList;
import com.example.emailcampaign.list.domain.ListContact;
import com.example.emailcampaign.list.domain.ListContactId;
import com.example.emailcampaign.list.dto.*;
import com.example.emailcampaign.list.mapper.ListMapper;
import com.example.emailcampaign.list.repository.AudienceListRepository;
import com.example.emailcampaign.list.repository.ListContactRepository;
import com.example.emailcampaign.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AudienceListServiceImpl implements AudienceListService {

    private final AudienceListRepository listRepository;
    private final ListContactRepository listContactRepository;
    private final ContactRepository contactRepository;
    private final WorkspaceRepository workspaceRepository;
    private final ListMapper listMapper;

    @Override
    @Transactional(readOnly = true)
    public List<AudienceListResponse> getLists(UUID workspaceId) {
        return listRepository.findAllByWorkspace_Id(workspaceId)
                .stream()
                .map(listMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AudienceListResponse getList(UUID workspaceId, UUID listId) {
        return listMapper.toResponse(findListOrThrow(workspaceId, listId));
    }

    @Override
    @Transactional
    public AudienceListResponse createList(UUID workspaceId, CreateListRequest request) {
        AudienceList list = AudienceList.builder()
                .workspace(workspaceRepository.getReferenceById(workspaceId))
                .name(request.name())
                .build();
        return listMapper.toResponse(listRepository.save(list));
    }

    @Override
    @Transactional
    public AudienceListResponse updateList(UUID workspaceId, UUID listId, UpdateListRequest request) {
        AudienceList list = findListOrThrow(workspaceId, listId);
        list.setName(request.name());
        return listMapper.toResponse(listRepository.save(list));
    }

    @Override
    @Transactional
    public void deleteList(UUID workspaceId, UUID listId) {
        AudienceList list = findListOrThrow(workspaceId, listId);
        listRepository.delete(list);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListContactResponse> getListContacts(UUID workspaceId, UUID listId) {
        findListOrThrow(workspaceId, listId);
        return listContactRepository.findAllById_ListId(listId)
                .stream()
                .map(listMapper::toContactResponse)
                .toList();
    }

    @Override
    @Transactional
    public void addContacts(UUID workspaceId, UUID listId, BulkContactRequest request) {
        AudienceList list = findListOrThrow(workspaceId, listId);
        int added = 0;

        for (UUID contactId : request.contactIds()) {
            Contact contact = contactRepository.findByIdAndWorkspace_Id(contactId, workspaceId)
                    .orElseThrow(() -> ApiException.notFound("CONTACT_NOT_FOUND", "Contact not found: " + contactId));

            ListContactId compositeId = new ListContactId(listId, contactId);
            if (listContactRepository.existsById(compositeId)) continue;

            listContactRepository.save(ListContact.builder()
                    .id(compositeId)
                    .list(list)
                    .contact(contact)
                    .build());
            added++;
        }

        list.setContactCount(list.getContactCount() + added);
        listRepository.save(list);
    }

    @Override
    @Transactional
    public void removeContact(UUID workspaceId, UUID listId, UUID contactId) {
        AudienceList list = findListOrThrow(workspaceId, listId);

        ListContactId compositeId = new ListContactId(listId, contactId);
        if (!listContactRepository.existsById(compositeId)) {
            throw ApiException.notFound("CONTACT_NOT_IN_LIST", "Contact is not a member of this list");
        }

        listContactRepository.deleteById(compositeId);
        list.setContactCount(Math.max(0, list.getContactCount() - 1));
        listRepository.save(list);
    }

    private AudienceList findListOrThrow(UUID workspaceId, UUID listId) {
        return listRepository.findByIdAndWorkspace_Id(listId, workspaceId)
                .orElseThrow(() -> ApiException.notFound("LIST_NOT_FOUND", "List not found: " + listId));
    }
}
