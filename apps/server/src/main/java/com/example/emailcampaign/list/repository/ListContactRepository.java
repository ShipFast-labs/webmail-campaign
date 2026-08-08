package com.example.emailcampaign.list.repository;

import com.example.emailcampaign.list.domain.ListContact;
import com.example.emailcampaign.list.domain.ListContactId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ListContactRepository extends JpaRepository<ListContact, ListContactId> {

    List<ListContact> findAllById_ListId(UUID listId);
}
