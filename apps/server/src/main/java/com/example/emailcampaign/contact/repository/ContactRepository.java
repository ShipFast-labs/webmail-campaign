package com.example.emailcampaign.contact.repository;

import com.example.emailcampaign.contact.domain.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContactRepository extends JpaRepository<Contact, UUID>, JpaSpecificationExecutor<Contact> {

    Optional<Contact> findByIdAndWorkspace_Id(UUID id, UUID workspaceId);

    boolean existsByWorkspace_IdAndEmail(UUID workspaceId, String email);

    List<Contact> findByWorkspace_IdAndEmailIn(UUID workspaceId, List<String> emails);
}
