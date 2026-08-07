package com.example.emailcampaign.contact.dto;

import jakarta.validation.constraints.Size;

import java.util.Map;

public record UpdateContactRequest(

        @Size(max = 100, message = "First name must not exceed 100 characters")
        String firstName,

        @Size(max = 100, message = "Last name must not exceed 100 characters")
        String lastName,

        Map<String, Object> customFields,

        @Size(max = 20, message = "A contact can have at most 20 tags")
        String[] tags
) {}
