package com.example.emailcampaign.campaign.scheduler;

import com.example.emailcampaign.campaign.service.CampaignService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@DisallowConcurrentExecution
@RequiredArgsConstructor
public class CampaignSendJob implements Job {

    private final CampaignService campaignService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        JobDataMap data = context.getMergedJobDataMap();
        UUID campaignId  = UUID.fromString(data.getString("campaignId"));
        UUID workspaceId = UUID.fromString(data.getString("workspaceId"));

        log.info("Firing scheduled send for campaign={} workspace={}", campaignId, workspaceId);

        try {
            campaignService.sendNow(workspaceId, campaignId);
        } catch (Exception e) {
            log.error("Failed to send campaign={}", campaignId, e);
            throw new JobExecutionException(e, false);
        }
    }
}
