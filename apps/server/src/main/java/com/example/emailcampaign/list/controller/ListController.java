package com.example.emailcampaign.list.controller;

import com.example.emailcampaign.common.api.ApiResponse;
import com.example.emailcampaign.common.context.WorkspaceContext;
import com.example.emailcampaign.list.dto.*;
import com.example.emailcampaign.list.service.AudienceListService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/lists")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Lists", description = "Audience list management — CRUD and contact membership")
public class ListController {

    private final AudienceListService listService;

    @GetMapping
    @Operation(summary = "Get all lists", description = "Returns all audience lists in the current workspace")
    public ResponseEntity<ApiResponse<List<AudienceListResponse>>> getLists() {
        return ResponseEntity.ok(ApiResponse.ok(listService.getLists(workspaceId())));
    }

    @PostMapping
    @Operation(summary = "Create list", description = "Creates a new audience list in the current workspace")
    public ResponseEntity<ApiResponse<AudienceListResponse>> createList(
            @Valid @RequestBody CreateListRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(listService.createList(workspaceId(), request)));
    }

    @GetMapping("/{listId}")
    @Operation(summary = "Get list", description = "Returns a single audience list by ID")
    public ResponseEntity<ApiResponse<AudienceListResponse>> getList(@PathVariable UUID listId) {
        return ResponseEntity.ok(ApiResponse.ok(listService.getList(workspaceId(), listId)));
    }

    @PutMapping("/{listId}")
    @Operation(summary = "Update list", description = "Renames an existing audience list")
    public ResponseEntity<ApiResponse<AudienceListResponse>> updateList(
            @PathVariable UUID listId,
            @Valid @RequestBody UpdateListRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(listService.updateList(workspaceId(), listId, request)));
    }

    @DeleteMapping("/{listId}")
    @Operation(summary = "Delete list", description = "Deletes an audience list and all its memberships")
    public ResponseEntity<ApiResponse<Void>> deleteList(@PathVariable UUID listId) {
        listService.deleteList(workspaceId(), listId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/{listId}/contacts")
    @Operation(summary = "Get list contacts", description = "Returns all contacts that belong to the audience list")
    public ResponseEntity<ApiResponse<List<ListContactResponse>>> getListContacts(@PathVariable UUID listId) {
        return ResponseEntity.ok(ApiResponse.ok(listService.getListContacts(workspaceId(), listId)));
    }

    @PostMapping("/{listId}/contacts")
    @Operation(summary = "Add contacts to list", description = "Adds up to 500 contacts to an audience list in bulk")
    public ResponseEntity<ApiResponse<Void>> addContacts(
            @PathVariable UUID listId,
            @Valid @RequestBody BulkContactRequest request
    ) {
        listService.addContacts(workspaceId(), listId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(null));
    }

    @DeleteMapping("/{listId}/contacts/{contactId}")
    @Operation(summary = "Remove contact from list", description = "Removes a single contact from the audience list")
    public ResponseEntity<ApiResponse<Void>> removeContact(
            @PathVariable UUID listId,
            @PathVariable UUID contactId
    ) {
        listService.removeContact(workspaceId(), listId, contactId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    private UUID workspaceId() {
        return WorkspaceContext.getCurrentWorkspaceId();
    }
}
