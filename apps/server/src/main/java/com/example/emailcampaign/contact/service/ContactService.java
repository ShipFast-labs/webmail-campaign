package com.example.emailcampaign.contact.service;

import com.example.emailcampaign.contact.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface ContactService {

    Page<ContactResponse> getContacts(UUID workspaceId, String status, String search, String tag, UUID listId, Pageable pageable);

    ContactResponse getContact(UUID workspaceId, UUID contactId);

    ContactResponse createContact(UUID workspaceId, CreateContactRequest request);

    ContactResponse updateContact(UUID workspaceId, UUID contactId, UpdateContactRequest request);

    void deleteContact(UUID workspaceId, UUID contactId);

    ContactResponse unsubscribeContact(UUID workspaceId, UUID contactId);

    ImportJobResponse importContacts(UUID workspaceId, MultipartFile file);

    ImportProgressResponse getImportProgress(UUID workspaceId, UUID jobId);
}
