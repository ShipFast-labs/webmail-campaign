package com.example.emailcampaign.list.repository;

import com.example.emailcampaign.list.domain.ListContact;
import com.example.emailcampaign.list.domain.ListContactId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ListContactRepository extends JpaRepository<ListContact, ListContactId> {

    List<ListContact> findAllById_ListId(UUID listId);
}
