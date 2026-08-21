package com.example.emailcampaign.list.repository;

import com.example.emailcampaign.list.domain.ListContact;
import com.example.emailcampaign.list.domain.ListContactId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ListContactRepository extends JpaRepository<ListContact, ListContactId> {

    List<ListContact> findAllById_ListId(UUID listId);

    long countById_ListId(UUID listId);

    @Query("SELECT lc FROM ListContact lc JOIN FETCH lc.contact WHERE lc.id.listId = :listId")
    Page<ListContact> findByListIdWithContact(@Param("listId") UUID listId, Pageable pageable);
}
