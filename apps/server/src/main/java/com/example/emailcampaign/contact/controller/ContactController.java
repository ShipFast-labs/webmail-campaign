package com.example.emailcampaign.contact.controller;

import com.example.emailcampaign.common.api.ApiResponse;
import com.example.emailcampaign.common.api.PageResponse;
import com.example.emailcampaign.common.context.WorkspaceContext;
import com.example.emailcampaign.contact.dto.*;
import com.example.emailcampaign.contact.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/contacts")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Contacts", description = "Contact management — CRUD, filtering, CSV import, and unsubscribe")
public class ContactController {

    private final ContactService contactService;

    @GetMapping
    @Operation(summary = "List contacts", description = "Paginated contact list, filterable by status, tag, search term, and list membership")
    public ResponseEntity<ApiResponse<List<ContactResponse>>> getContacts(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) UUID listId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        UUID workspaceId = WorkspaceContext.getCurrentWorkspaceId();
        Page<ContactResponse> result = contactService.getContacts(workspaceId, status, search, tag, listId, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.ok(result.getContent(), PageResponse.from(result)));
    }

    @PostMapping
    @Operation(summary = "Create contact", description = "Creates a new contact in the current workspace")
    public ResponseEntity<ApiResponse<ContactResponse>> createContact(
            @Valid @RequestBody CreateContactRequest request
    ) {
        UUID workspaceId = WorkspaceContext.getCurrentWorkspaceId();
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(contactService.createContact(workspaceId, request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get contact", description = "Returns a single contact by ID")
    public ResponseEntity<ApiResponse<ContactResponse>> getContact(@PathVariable UUID id) {
        UUID workspaceId = WorkspaceContext.getCurrentWorkspaceId();
        return ResponseEntity.ok(ApiResponse.ok(contactService.getContact(workspaceId, id)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update contact", description = "Updates fields on an existing contact")
    public ResponseEntity<ApiResponse<ContactResponse>> updateContact(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateContactRequest request
    ) {
        UUID workspaceId = WorkspaceContext.getCurrentWorkspaceId();
        return ResponseEntity.ok(ApiResponse.ok(contactService.updateContact(workspaceId, id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete contact", description = "Soft-deletes a contact by marking it as CLEANED")
    public ResponseEntity<ApiResponse<Void>> deleteContact(@PathVariable UUID id) {
        UUID workspaceId = WorkspaceContext.getCurrentWorkspaceId();
        contactService.deleteContact(workspaceId, id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PostMapping("/{id}/unsubscribe")
    @Operation(summary = "Unsubscribe contact", description = "Sets contact status to UNSUBSCRIBED")
    public ResponseEntity<ApiResponse<ContactResponse>> unsubscribeContact(@PathVariable UUID id) {
        UUID workspaceId = WorkspaceContext.getCurrentWorkspaceId();
        return ResponseEntity.ok(ApiResponse.ok(contactService.unsubscribeContact(workspaceId, id)));
    }

    @PostMapping("/import")
    @Operation(summary = "Import contacts via CSV", description = "Uploads a CSV file and starts an async import job; returns the import job ID")
    public ResponseEntity<ApiResponse<ImportJobResponse>> importContacts(@RequestParam("file") MultipartFile file) {
        UUID workspaceId = WorkspaceContext.getCurrentWorkspaceId();
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(ApiResponse.ok(contactService.importContacts(workspaceId, file)));
    }

    @GetMapping("/import/{jobId}")
    @Operation(summary = "Poll import progress", description = "Returns current progress of a CSV import job (reads from Redis first)")
    public ResponseEntity<ApiResponse<ImportProgressResponse>> getImportProgress(@PathVariable UUID jobId) {
        UUID workspaceId = WorkspaceContext.getCurrentWorkspaceId();
        return ResponseEntity.ok(ApiResponse.ok(contactService.getImportProgress(workspaceId, jobId)));
    }
}
