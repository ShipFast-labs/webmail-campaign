package com.example.emailcampaign.template.service;

import com.example.emailcampaign.template.dto.*;

import java.util.List;
import java.util.UUID;

public interface TemplateService {

    List<TemplateResponse> getTemplates(UUID workspaceId);

    TemplateResponse getTemplate(UUID workspaceId, UUID templateId);

    TemplateResponse createTemplate(UUID workspaceId, CreateTemplateRequest request);

    TemplateResponse updateTemplate(UUID workspaceId, UUID templateId, UpdateTemplateRequest request);

    void deleteTemplate(UUID workspaceId, UUID templateId);

    TemplatePreviewResponse previewTemplate(UUID workspaceId, UUID templateId, TemplatePreviewRequest request);

    TemplateResponse duplicateTemplate(UUID workspaceId, UUID templateId);
}
