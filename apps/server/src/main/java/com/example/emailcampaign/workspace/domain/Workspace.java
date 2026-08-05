package com.example.emailcampaign.workspace.domain;

import com.example.emailcampaign.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "workspaces")
public class Workspace extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private UUID ownerId;

    public Workspace(String name, UUID ownerId) {
        this.name = name;
        this.ownerId = ownerId;
    }
}
