package com.example.emailcampaign.campaign.domain;

import com.example.emailcampaign.common.domain.BaseEntity;
import com.example.emailcampaign.list.domain.AudienceList;
import com.example.emailcampaign.template.domain.Template;
import com.example.emailcampaign.workspace.domain.Workspace;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "campaigns")
public class Campaign extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String subject;

    @Column(name = "from_name", nullable = false)
    private String fromName;

    @Column(name = "from_email", nullable = false)
    private String fromEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CampaignStatus status = CampaignStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_list_id", nullable = false)
    private AudienceList targetList;

    @Column(name = "scheduled_at")
    private Instant scheduledAt;

    @Version
    @Column(nullable = false)
    private Long version;
}
