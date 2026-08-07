package com.example.emailcampaign.contact.repository;

import com.example.emailcampaign.contact.domain.Contact;
import com.example.emailcampaign.contact.domain.Status;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class ContactSpecification {

    private ContactSpecification() {}

    public static Specification<Contact> withWorkspaceId(UUID workspaceId) {
        return (root, query, cb) ->
                cb.equal(root.get("workspace").get("id"), workspaceId);
    }

    public static Specification<Contact> excludeCleaned() {
        return (root, query, cb) ->
                cb.notEqual(root.get("status"), Status.CLEANED);
    }

    public static Specification<Contact> withStatus(Status status) {
        if (status == null) return null;
        return (root, query, cb) ->
                cb.equal(root.get("status"), status);
    }

    public static Specification<Contact> withSearch(String search) {
        if (search == null || search.isBlank()) return null;
        return (root, query, cb) -> {
            String pattern = "%" + search.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(cb.lower(root.get("firstName")), pattern),
                    cb.like(cb.lower(root.get("lastName")), pattern)
            );
        };
    }

    public static Specification<Contact> withTag(String tag) {
        if (tag == null || tag.isBlank()) return null;
        return (root, query, cb) -> {
            Expression<String> tagsStr = cb.function(
                    "array_to_string", String.class, root.get("tags"), cb.literal(","));
            return cb.like(cb.lower(tagsStr), "%" + tag.trim().toLowerCase() + "%");
        };
    }
}
