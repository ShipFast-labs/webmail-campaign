import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useContacts } from "@/hooks/use-contacts";
import { useDebounce } from "@/hooks/use-debounce";
import type { Contact } from "@/api/contacts";
import { ContactsHeader } from "@/components/contacts/contacts-header";
import { ContactsFilters } from "@/components/contacts/contacts-filters";
import { ContactsTable } from "@/components/contacts/contacts-table";
import { ContactFormModal } from "@/components/contacts/contact-form-modal";
import { ImportModal } from "@/components/contacts/import-modal";

import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

const contactsSearchSchema = z.object({
  page: z.number().catch(0),
  search: z.string().catch(""),
  status: z.string().catch(""),
  tag: z.string().catch(""),
  workspace: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/_app/contacts")({
  validateSearch: (search) => contactsSearchSchema.parse(search),
  component: ContactsPage,
});

function ContactsPage() {
  const { page, search, status, tag } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);

  const debouncedSearch = useDebounce(search);
  const debouncedTag = useDebounce(tag);

  const { data, isLoading, isFetching } = useContacts({
    page,
    size: 20,
    search: debouncedSearch || undefined,
    status: status || undefined,
    tag: debouncedTag || undefined,
  });

  const handleEdit = (contact: Contact) => {
    setEditContact(contact);
    setFormOpen(true);
  };

  const handleSearchChange = (value: string) => {
    navigate({ search: (prev) => ({ ...prev, search: value, page: 0 }), replace: true });
  };

  const handleStatusChange = (value: string) => {
    navigate({ search: (prev) => ({ ...prev, status: value, page: 0 }), replace: true });
  };

  const handleTagChange = (value: string) => {
    navigate({ search: (prev) => ({ ...prev, tag: value, page: 0 }), replace: true });
  };

  const setPage = (updater: number | ((prev: number) => number)) => {
    const newPage = typeof updater === "function" ? updater(page) : updater;
    navigate({ search: (prev) => ({ ...prev, page: newPage }), replace: true });
  };

  return (
    <div className="space-y-4">
      <ContactsHeader
        totalElements={data?.pagination.totalElements}
        onAdd={() => { setEditContact(null); setFormOpen(true); }}
        onImport={() => setImportOpen(true)}
      />

      <ContactsFilters
        search={search}
        tag={tag}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onTagChange={handleTagChange}
        page={page}
        totalPages={data?.pagination.totalPages ?? 0}
        onPrev={() => setPage(p => p - 1)}
        onNext={() => setPage(p => p + 1)}
      />

      <ContactsTable
        contacts={data?.contacts ?? []}
        isLoading={isLoading}
        isFetching={isFetching}
        page={page}
        onEdit={handleEdit}
      />

      <ContactFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditContact(null); }}
        contact={editContact}
      />
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
