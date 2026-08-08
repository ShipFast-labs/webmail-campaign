package com.example.emailcampaign.template.domain;

import com.example.emailcampaign.common.domain.BaseEntity;
import com.example.emailcampaign.workspace.domain.Workspace;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "templates")
public class Template extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String subject;

    @Column(name = "html_content", nullable = false, columnDefinition = "text")
    private String htmlContent;

    @Column(name = "text_content", columnDefinition = "text")
    private String textContent;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, String> variables;
}
