package com.example.emailcampaign.list.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ListContactId implements Serializable {

    @Column(name = "list_id")
    private UUID listId;

    @Column(name = "contact_id")
    private UUID contactId;
}
