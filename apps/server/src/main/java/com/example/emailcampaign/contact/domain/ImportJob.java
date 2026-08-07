package com.example.emailcampaign.contact.domain;

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
@Table(name = "import_jobs")
public class ImportJob extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Column(nullable = false)
    private String fileName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ImportJobStatus status = ImportJobStatus.PENDING;

    @Column(nullable = false)
    private int totalRows = 0;

    @Column(nullable = false)
    private int processedRows = 0;

    @Column(nullable = false)
    private int successCount = 0;

    @Column(nullable = false)
    private int errorCount = 0;

    @Column(columnDefinition = "text")
    private String errorDetails;

   
}
