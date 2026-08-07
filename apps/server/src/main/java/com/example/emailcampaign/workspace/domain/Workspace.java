package com.example.emailcampaign.workspace.domain;

import com.example.emailcampaign.common.domain.BaseEntity;
import com.example.emailcampaign.contact.domain.Contact;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "workspaces")
@RequiredArgsConstructor
public class Workspace extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private UUID ownerId;

   
}
