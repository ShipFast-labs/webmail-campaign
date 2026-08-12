package com.example.emailcampaign.campaign.domain;

import com.example.emailcampaign.common.exception.ApiException;

import java.util.EnumMap;
import java.util.Map;
import java.util.Set;

import static com.example.emailcampaign.campaign.domain.CampaignStatus.*;

public final class CampaignStateMachine {

    private static final Map<CampaignStatus, Set<CampaignStatus>> VALID_TRANSITIONS;

    static {
        VALID_TRANSITIONS = new EnumMap<>(CampaignStatus.class);
        VALID_TRANSITIONS.put(DRAFT,     Set.of(SCHEDULED, SENDING, CANCELLED));
        VALID_TRANSITIONS.put(SCHEDULED, Set.of(SENDING, CANCELLED));
        VALID_TRANSITIONS.put(SENDING,   Set.of(PAUSED, COMPLETED, CANCELLED));
        VALID_TRANSITIONS.put(PAUSED,    Set.of(SENDING, CANCELLED));
        VALID_TRANSITIONS.put(COMPLETED, Set.of());
        VALID_TRANSITIONS.put(CANCELLED, Set.of());
    }

    private CampaignStateMachine() {}

    public static void transition(Campaign campaign, CampaignStatus to) {
        CampaignStatus from = campaign.getStatus();
        if (!VALID_TRANSITIONS.getOrDefault(from, Set.of()).contains(to)) {
            throw ApiException.badRequest(
                    "INVALID_TRANSITION",
                    "Cannot transition campaign from " + from + " to " + to
            );
        }
        campaign.setStatus(to);
    }
}
