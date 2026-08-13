package com.example.emailcampaign.campaign.service;

import com.example.emailcampaign.campaign.domain.Campaign;
import com.example.emailcampaign.campaign.domain.CampaignContact;
import com.example.emailcampaign.campaign.domain.CampaignStateMachine;
import com.example.emailcampaign.campaign.domain.CampaignStatus;
import com.example.emailcampaign.campaign.service.CampaignSendOrchestrator;
import com.example.emailcampaign.campaign.dto.CampaignContactResponse;
import com.example.emailcampaign.campaign.dto.CampaignResponse;
import com.example.emailcampaign.campaign.dto.CreateCampaignRequest;
import com.example.emailcampaign.campaign.dto.ScheduleCampaignRequest;
import com.example.emailcampaign.campaign.mapper.CampaignMapper;
import com.example.emailcampaign.campaign.repository.CampaignContactRepository;
import com.example.emailcampaign.campaign.repository.CampaignRepository;
import com.example.emailcampaign.campaign.scheduler.CampaignSchedulerService;
import com.example.emailcampaign.common.api.ApiResponse;
import com.example.emailcampaign.common.api.PageResponse;
import com.example.emailcampaign.common.exception.ApiException;
import com.example.emailcampaign.list.repository.AudienceListRepository;
import com.example.emailcampaign.template.repository.TemplateRepository;
import com.example.emailcampaign.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.example.emailcampaign.campaign.domain.CampaignStatus.*;

@Service
@RequiredArgsConstructor
public class CampaignServiceImpl implements CampaignService {

    private final CampaignRepository campaignRepository;
    private final CampaignContactRepository campaignContactRepository;
    private final WorkspaceRepository workspaceRepository;
    private final TemplateRepository templateRepository;
    private final AudienceListRepository listRepository;
    private final CampaignMapper campaignMapper;
    private final CampaignSchedulerService schedulerService;
    private final CampaignSendOrchestrator orchestrator;

    @Override
    @Transactional(readOnly = true)
    public List<CampaignResponse> getCampaigns(UUID workspaceId) {
        return campaignRepository.findAllByWorkspace_IdOrderByCreatedAtDesc(workspaceId)
                .stream()
                .map(campaignMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CampaignResponse getCampaign(UUID workspaceId, UUID campaignId) {
        return campaignMapper.toResponse(findOrThrow(workspaceId, campaignId));
    }

    @Override
    @Transactional
    public CampaignResponse createCampaign(UUID workspaceId, CreateCampaignRequest request) {
        Campaign campaign = Campaign.builder()
                .workspace(workspaceRepository.getReferenceById(workspaceId))
                .name(request.name())
                .subject(request.subject())
                .fromName(request.fromName())
                .fromEmail(request.fromEmail())
                .template(templateRepository.findById(request.templateId())
                        .orElseThrow(() -> ApiException.notFound("TEMPLATE_NOT_FOUND", "Template not found")))
                .targetList(listRepository.findById(request.targetListId())
                        .orElseThrow(() -> ApiException.notFound("LIST_NOT_FOUND", "List not found")))
                .build();

        return campaignMapper.toResponse(campaignRepository.save(campaign));
    }

    @Override
    @Transactional
    public CampaignResponse sendNow(UUID workspaceId, UUID campaignId) {
        Campaign campaign = findOrThrow(workspaceId, campaignId);
        boolean wasScheduled = campaign.getStatus() == SCHEDULED;
        orchestrator.initiateSend(campaign, workspaceId);
        if (wasScheduled) {
            schedulerService.unscheduleCampaign(campaignId);
        }
        return campaignMapper.toResponse(campaign);
    }

    @Override
    @Transactional
    public CampaignResponse schedule(UUID workspaceId, UUID campaignId, ScheduleCampaignRequest request) {
        Campaign campaign = findOrThrow(workspaceId, campaignId);
        CampaignStateMachine.transition(campaign, SCHEDULED);
        campaign.setScheduledAt(request.scheduledAt());
        CampaignResponse response = campaignMapper.toResponse(campaignRepository.save(campaign));
        schedulerService.scheduleCampaign(campaignId, workspaceId, request.scheduledAt());
        return response;
    }

    @Override
    @Transactional
    public CampaignResponse pause(UUID workspaceId, UUID campaignId) {
        Campaign campaign = findOrThrow(workspaceId, campaignId);
        CampaignStateMachine.transition(campaign, PAUSED);
        return campaignMapper.toResponse(campaignRepository.save(campaign));
    }

    @Override
    @Transactional
    public CampaignResponse resume(UUID workspaceId, UUID campaignId) {
        Campaign campaign = findOrThrow(workspaceId, campaignId);
        CampaignStateMachine.transition(campaign, SENDING);
        return campaignMapper.toResponse(campaignRepository.save(campaign));
    }

    @Override
    @Transactional
    public CampaignResponse cancel(UUID workspaceId, UUID campaignId) {
        Campaign campaign = findOrThrow(workspaceId, campaignId);
        boolean wasScheduled = campaign.getStatus() == SCHEDULED;
        CampaignStateMachine.transition(campaign, CANCELLED);
        CampaignResponse response = campaignMapper.toResponse(campaignRepository.save(campaign));
        if (wasScheduled) {
            schedulerService.unscheduleCampaign(campaignId);
        }
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<CampaignContactResponse>> getCampaignContacts(UUID workspaceId, UUID campaignId, int page, int size) {
        findOrThrow(workspaceId, campaignId);  // ownership check
        Page<CampaignContact> result = campaignContactRepository.findByCampaignIdWithContact(
                campaignId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"))
        );
        List<CampaignContactResponse> items = result.getContent().stream()
                .map(cc -> new CampaignContactResponse(
                        cc.getId().getContactId(),
                        cc.getContact().getEmail(),
                        cc.getContact().getFirstName(),
                        cc.getContact().getLastName(),
                        cc.getStatus().name(),
                        cc.getUpdatedAt()
                ))
                .toList();
        return ApiResponse.ok(items, PageResponse.from(result));
    }

    private Campaign findOrThrow(UUID workspaceId, UUID campaignId) {
        return campaignRepository.findByIdAndWorkspace_Id(campaignId, workspaceId)
                .orElseThrow(() -> ApiException.notFound("CAMPAIGN_NOT_FOUND", "Campaign not found: " + campaignId));
    }
}
