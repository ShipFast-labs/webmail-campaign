package com.example.emailcampaign.contact.repository;

import com.example.emailcampaign.contact.domain.Contact;
import com.example.emailcampaign.contact.domain.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContactRepository extends JpaRepository<Contact, UUID>, JpaSpecificationExecutor<Contact> {

    Optional<Contact> findByIdAndWorkspace_Id(UUID id, UUID workspaceId);

    boolean existsByWorkspace_IdAndEmail(UUID workspaceId, String email);

    List<Contact> findByWorkspace_IdAndEmailIn(UUID workspaceId, List<String> emails);

    @Transactional
    @Modifying
    @Query("UPDATE Contact c SET c.status = :status WHERE c.id = :contactId AND c.status = 'ACTIVE'")
    void updateStatusIfActive(@Param("contactId") UUID contactId, @Param("status") Status status);

    @Transactional
    @Modifying
    @Query("UPDATE Contact c SET c.status = 'UNSUBSCRIBED' WHERE c.id = :contactId AND c.status <> 'CLEANED'")
    void markUnsubscribed(@Param("contactId") UUID contactId);
}
