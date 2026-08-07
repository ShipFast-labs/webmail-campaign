package com.example.emailcampaign.contact.service;

import com.example.emailcampaign.common.exception.ApiException;
import com.example.emailcampaign.contact.domain.Contact;
import com.example.emailcampaign.contact.domain.ImportJob;
import com.example.emailcampaign.contact.domain.Status;
import com.example.emailcampaign.contact.dto.*;
import com.example.emailcampaign.contact.mapper.ContactMapper;
import com.example.emailcampaign.contact.repository.ContactRepository;
import com.example.emailcampaign.contact.repository.ContactSpecification;
import com.example.emailcampaign.contact.repository.ImportJobRepository;
import com.example.emailcampaign.common.service.S3Service;
import com.example.emailcampaign.kafka.producer.ContactImportProducer;
import com.example.emailcampaign.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final ImportJobRepository importJobRepository;
    private final WorkspaceRepository workspaceRepository;
    private final ContactMapper contactMapper;
    private final ContactImportProducer contactImportProducer;
    private final S3Service s3Service;
    private final StringRedisTemplate redisTemplate;

    @Override
    @Transactional(readOnly = true)
    public Page<ContactResponse> getContacts(UUID workspaceId, String status, String search, String tag, UUID listId, Pageable pageable) {
        Status parsedStatus = parseStatus(status);

        Specification<Contact> spec = Specification
                .where(ContactSpecification.withWorkspaceId(workspaceId))
                .and(ContactSpecification.excludeCleaned())
                .and(ContactSpecification.withStatus(parsedStatus))
                .and(ContactSpecification.withSearch(search))
                .and(ContactSpecification.withTag(tag));

        return contactRepository.findAll(spec, pageable).map(contactMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ContactResponse getContact(UUID workspaceId, UUID contactId) {
        Contact contact = findContactOrThrow(workspaceId, contactId);
        return contactMapper.toResponse(contact);
    }

    @Override
    @Transactional
    public ContactResponse createContact(UUID workspaceId, CreateContactRequest request) {
        if (contactRepository.existsByWorkspace_IdAndEmail(workspaceId, request.email())) {
            throw ApiException.conflict("CONTACT_ALREADY_EXISTS", "A contact with this email already exists in the workspace");
        }
        
        Contact contact = Contact
                                  .builder()
                                  .workspace( workspaceRepository.getReferenceById(workspaceId))
                                  .email(request.email())
                                  .firstName(request.firstName())
                                  .lastName(request.lastName())
                                  .customFields(request.customFields())
                                  .tags(request.tags())
                                  .build();
        

        return contactMapper.toResponse(contactRepository.save(contact));
    }

    @Override
    @Transactional
    public ContactResponse updateContact(UUID workspaceId, UUID contactId, UpdateContactRequest request) {
        Contact contact = findContactOrThrow(workspaceId, contactId);

        if(request.firstName() != null) contact.setFirstName(request.firstName());
        if(request.lastName() != null) contact.setLastName(request.lastName());
        if(request.customFields() != null) contact.setCustomFields(request.customFields());
        if(request.tags() != null) contact.setTags(request.tags());

        return contactMapper.toResponse(contactRepository.save(contact));
    }

    @Override
    @Transactional
    public void deleteContact(UUID workspaceId, UUID contactId) {
        Contact contact = findContactOrThrow(workspaceId, contactId);
        contact.setStatus(Status.CLEANED);
        contactRepository.save(contact);
    }

    @Override
    @Transactional
    public ContactResponse unsubscribeContact(UUID workspaceId, UUID contactId) {
        Contact contact = findContactOrThrow(workspaceId, contactId);
        contact.setStatus(Status.UNSUBSCRIBED);
        return contactMapper.toResponse(contactRepository.save(contact));
    }

    @Override
    @Transactional
    public ImportJobResponse importContacts(UUID workspaceId, MultipartFile file) {
        try {
            byte[] csvBytes = file.getBytes();

            ImportJob job = ImportJob.builder()
                    .workspace(workspaceRepository.getReferenceById(workspaceId))
                    .fileName(file.getOriginalFilename())
                    .build();
            job = importJobRepository.save(job);

           
            s3Service.uploadImportFile(workspaceId, job.getId(), csvBytes);

            
            contactImportProducer.publish(workspaceId, job.getId());

            return new ImportJobResponse(job.getId());
        } catch (Exception e) {
            throw ApiException.badRequest("IMPORT_FAILED", "Failed to start import: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ImportProgressResponse getImportProgress(UUID workspaceId, UUID jobId) {
        String key = "import:" + jobId + ":progress";
        Map<Object, Object> redisData = redisTemplate.opsForHash().entries(key);

        if (!redisData.isEmpty()) {
            return new ImportProgressResponse(
                    jobId,
                    (String) redisData.get("status"),
                    Integer.parseInt((String) redisData.get("totalRows")),
                    Integer.parseInt((String) redisData.get("processedRows")),
                    Integer.parseInt((String) redisData.get("successCount")),
                    Integer.parseInt((String) redisData.get("errorCount")),
                    null
            );
        }

        ImportJob job = importJobRepository.findByIdAndWorkspace_Id(jobId, workspaceId)
                .orElseThrow(() -> ApiException.notFound("IMPORT_JOB_NOT_FOUND", "Import job not found: " + jobId));

        return contactMapper.toImportProgressResponse(job);
    }

    private Contact findContactOrThrow(UUID workspaceId, UUID contactId) {
        return contactRepository.findByIdAndWorkspace_Id(contactId, workspaceId)
                .orElseThrow(() -> ApiException.notFound("CONTACT_NOT_FOUND", "Contact not found: " + contactId));
    }

    private Status parseStatus(String status) {
        if (status == null || status.isBlank()) return null;
        try {
            return Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ApiException.badRequest("INVALID_STATUS", "Invalid status value: " + status);
        }
    }
}
