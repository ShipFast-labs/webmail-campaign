package com.example.emailcampaign.campaign.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CampaignContactId implements Serializable {

    @Column(name = "campaign_id", nullable = false)
    private UUID campaignId;

    @Column(name = "contact_id", nullable = false)
    private UUID contactId;
}
