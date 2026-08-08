package com.example.emailcampaign.list.domain;

import com.example.emailcampaign.common.domain.BaseEntity;
import com.example.emailcampaign.workspace.domain.Workspace;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "lists")
public class AudienceList extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Column(nullable = false)
    private String name;

    @Builder.Default
    @Column(name = "contact_count", nullable = false)
    private int contactCount = 0;
}
