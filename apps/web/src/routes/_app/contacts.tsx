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

export const Route = createFileRoute("/_app/contacts")({
  component: ContactsPage,
});

function ContactsPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [tag, setTag] = useState("");
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
    setSearch(value);
    setPage(0);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(0);
  };

  const handleTagChange = (value: string) => {
    setTag(value);
    setPage(0);
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
