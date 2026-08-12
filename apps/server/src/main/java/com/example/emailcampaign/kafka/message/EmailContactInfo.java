package com.example.emailcampaign.kafka.message;

import java.util.UUID;

public record EmailContactInfo(UUID contactId, String email, String firstName, String lastName) {}
