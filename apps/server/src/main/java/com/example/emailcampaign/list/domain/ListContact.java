package com.example.emailcampaign.list.domain;

import com.example.emailcampaign.contact.domain.Contact;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@Table(
    name = "list_contacts",
    uniqueConstraints = @UniqueConstraint(columnNames = {"list_id", "contact_id"})
)
public class ListContact {

    @EmbeddedId
    private ListContactId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("listId")
    @JoinColumn(name = "list_id", nullable = false)
    private AudienceList list;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("contactId")
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;

    @CreatedDate
    @Column(name = "added_at", nullable = false, updatable = false)
    private Instant addedAt;
}
