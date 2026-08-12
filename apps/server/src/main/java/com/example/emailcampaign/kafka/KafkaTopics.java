package com.example.emailcampaign.kafka;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public final class KafkaTopics {

    public static final String CAMPAIGN_SCHEDULED  = "email.campaign.scheduled";
    public static final String EMAIL_SEND_BATCHES  = "email.send.batches";
    public static final String TRACKING_EVENTS     = "email.tracking.events";
    public static final String CONTACT_EVENTS      = "email.contact.events";

   
}
