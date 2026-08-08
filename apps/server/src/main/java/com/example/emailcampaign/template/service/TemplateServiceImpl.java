package com.example.emailcampaign.template.service;

import com.example.emailcampaign.common.exception.ApiException;
import com.example.emailcampaign.template.domain.Template;
import com.example.emailcampaign.template.dto.*;
import com.example.emailcampaign.template.mapper.TemplateMapper;
import com.example.emailcampaign.template.repository.TemplateRepository;
import com.example.emailcampaign.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TemplateServiceImpl implements TemplateService {

    private final TemplateRepository templateRepository;
    private final WorkspaceRepository workspaceRepository;
    private final TemplateMapper templateMapper;
    private final TemplateRenderer templateRenderer;

    @Override
    @Transactional(readOnly = true)
    public List<TemplateResponse> getTemplates(UUID workspaceId) {
        return templateRepository.findAllByWorkspace_Id(workspaceId)
                .stream()
                .map(templateMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TemplateResponse getTemplate(UUID workspaceId, UUID templateId) {
        return templateMapper.toResponse(findTemplateOrThrow(workspaceId, templateId));
    }

    @Override
    @Transactional
    public TemplateResponse createTemplate(UUID workspaceId, CreateTemplateRequest request) {
        Template template = Template.builder()
                .workspace(workspaceRepository.getReferenceById(workspaceId))
                .name(request.name())
                .subject(request.subject() != null ? request.subject() : "")
                .htmlContent(request.htmlContent() != null ? request.htmlContent() : "")
                .textContent(request.textContent())
                .variables(request.variables())
                .build();
        return templateMapper.toResponse(templateRepository.save(template));
    }

    @Override
    @Transactional
    public TemplateResponse updateTemplate(UUID workspaceId, UUID templateId, UpdateTemplateRequest request) {
        Template template = findTemplateOrThrow(workspaceId, templateId);
        if (request.name() != null) template.setName(request.name());
        if (request.subject() != null) template.setSubject(request.subject());
        if (request.htmlContent() != null) template.setHtmlContent(request.htmlContent());
        if (request.textContent() != null) template.setTextContent(request.textContent());
        if (request.variables() != null) template.setVariables(request.variables());
        return templateMapper.toResponse(templateRepository.save(template));
    }

    @Override
    @Transactional
    public void deleteTemplate(UUID workspaceId, UUID templateId) {
        Template template = findTemplateOrThrow(workspaceId, templateId);
        templateRepository.delete(template);
    }

    @Override
    @Transactional(readOnly = true)
    public TemplatePreviewResponse previewTemplate(UUID workspaceId, UUID templateId, TemplatePreviewRequest request) {
        Template template = findTemplateOrThrow(workspaceId, templateId);
        Map<String, String> variables = request.variables() != null ? request.variables() : Map.of();
        return templateRenderer.renderPreview(template.getHtmlContent(), template.getTextContent(), variables);
    }

    @Override
    @Transactional
    public TemplateResponse duplicateTemplate(UUID workspaceId, UUID templateId) {
        Template original = findTemplateOrThrow(workspaceId, templateId);
        Template copy = Template.builder()
                .workspace(original.getWorkspace())
                .name("Copy of " + original.getName())
                .subject(original.getSubject())
                .htmlContent(original.getHtmlContent())
                .textContent(original.getTextContent())
                .variables(original.getVariables())
                .build();
        return templateMapper.toResponse(templateRepository.save(copy));
    }

    private Template findTemplateOrThrow(UUID workspaceId, UUID templateId) {
        return templateRepository.findByIdAndWorkspace_Id(templateId, workspaceId)
                .orElseThrow(() -> ApiException.notFound("TEMPLATE_NOT_FOUND", "Template not found: " + templateId));
    }
}
