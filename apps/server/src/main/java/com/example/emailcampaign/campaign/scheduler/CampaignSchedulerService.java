package com.example.emailcampaign.campaign.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobBuilder;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CampaignSchedulerService {

    private static final String JOB_GROUP = "campaigns";

    private final Scheduler scheduler;

    public void scheduleCampaign(UUID campaignId, UUID workspaceId, Instant scheduledAt) {
        JobDetail job = JobBuilder.newJob(CampaignSendJob.class)
                .withIdentity(jobKey(campaignId))
                .usingJobData(jobData(campaignId, workspaceId))
                .storeDurably()
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("trigger-" + campaignId, JOB_GROUP)
                .startAt(Date.from(scheduledAt))
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                        .withMisfireHandlingInstructionFireNow())
                .build();

        try {
            // Delete any existing job for this campaign first — makes this call idempotent
            // (deleteJob is a no-op if the key doesn't exist)
            scheduler.deleteJob(JobKey.jobKey(jobKey(campaignId), JOB_GROUP));
            scheduler.scheduleJob(job, trigger);
            log.info("Scheduled campaign={} at {}", campaignId, scheduledAt);
        } catch (SchedulerException e) {
            throw new RuntimeException("Failed to schedule campaign: " + campaignId, e);
        }
    }

    public void unscheduleCampaign(UUID campaignId) {
        try {
            boolean deleted = scheduler.deleteJob(JobKey.jobKey(jobKey(campaignId), JOB_GROUP));
            if (deleted) {
                log.info("Unscheduled campaign={}", campaignId);
            }
        } catch (SchedulerException e) {
            throw new RuntimeException("Failed to unschedule campaign: " + campaignId, e);
        }
    }

    private String jobKey(UUID campaignId) {
        return "campaign-" + campaignId;
    }

    private JobDataMap jobData(UUID campaignId, UUID workspaceId) {
        JobDataMap data = new JobDataMap();
        data.put("campaignId", campaignId.toString());
        data.put("workspaceId", workspaceId.toString());
        return data;
    }
}
