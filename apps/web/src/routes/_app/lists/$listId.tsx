import { createFileRoute, Link } from "@tanstack/react-router";
import { useLegacyTable, getCoreRowModel, legacyCreateColumnHelper } from "@tanstack/react-table/legacy";
import { flexRender } from "@tanstack/react-table";
import { useList, useListContacts, useRemoveContactFromList, useAddContactsToList } from "@/hooks/use-lists";
import { useContacts } from "@/hooks/use-contacts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  ArrowLeft01Icon, PlusSignIcon, Delete02Icon,
  Loading03Icon, UserMultiple02Icon, Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState, useMemo } from "react";
import type { ListContact } from "@/api/lists";

export const Route = createFileRoute("/_app/lists/$listId")({
  component: ListDetailPage,
});

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  UNSUBSCRIBED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  BOUNCED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  CLEANED: "bg-muted text-muted-foreground",
};

const col = legacyCreateColumnHelper<ListContact>();

function ListDetailPage() {
  const { listId } = Route.useParams();
  const { data: list, isLoading: isListLoading } = useList(listId);
  const { data: contacts, isLoading: isContactsLoading } = useListContacts(listId);
  const removeContact = useRemoveContactFromList();
  const [addOpen, setAddOpen] = useState(false);

  const columns = col.columns([
    col.accessor("email", { header: "Email", cell: (i) => <span className="font-medium">{i.getValue()}</span> }),
    col.accessor((r) => [r.firstName, r.lastName].filter(Boolean).join(" ") || "—", { id: "name", header: "Name" }),
    col.accessor("status", {
      header: "Status",
      cell: (i) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[i.getValue()]}`}>
          {i.getValue()}
        </span>
      ),
    }),
    col.accessor("addedAt", {
      header: "Added On",
      cell: (i) => <span className="text-muted-foreground">{new Date(i.getValue()).toLocaleDateString()}</span>,
    }),
    col.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.15 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => removeContact.mutate({ listId, contactId: row.original.contactId })}
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
            </Button>
          </motion.div>
        </div>
      ),
    }),
  ]);

  const table = useLegacyTable({
    data: contacts ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Button variant="ghost" size="sm" className="-ml-2 mb-1 text-muted-foreground h-7 px-2" asChild>
            <Link to="/lists">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} className="mr-1" />
              Lists
            </Link>
          </Button>
          {isListLoading ? (
            <Skeleton className="h-7 w-48 mt-0.5" />
          ) : (
            <h1 className="text-2xl font-semibold">{list?.name}</h1>
          )}
          <p className="text-sm text-muted-foreground mt-0.5">
            {contacts !== undefined ? `${contacts.length} contact${contacts.length !== 1 ? "s" : ""}` : "Loading…"}
          </p>
        </div>
        <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
          <Button onClick={() => setAddOpen(true)}>
            <HugeiconsIcon icon={PlusSignIcon} size={15} />
            Add Contacts
          </Button>
        </motion.div>
      </div>

      {/* Table */}
      <AnimatePresence mode="wait">
        {isContactsLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Card className="flex items-center justify-center py-24">
              <HugeiconsIcon icon={Loading03Icon} size={24} className="animate-spin text-muted-foreground" />
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="data"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
          >
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    {table.getHeaderGroups().map((hg) => (
                      <tr key={hg.id} className="border-b border-border/60">
                        {hg.headers.map((h) => (
                          <th key={h.id} className="text-left font-medium px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {flexRender(h.column.columnDef.header, h.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center py-20 text-muted-foreground">
                          <HugeiconsIcon icon={UserMultiple02Icon} size={32} className="mx-auto mb-3 opacity-40" />
                          <p>No contacts in this list yet.</p>
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map((row, i) => (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.12, delay: i * 0.02 }}
                          className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-4 py-3.5 whitespace-nowrap">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AddContactsModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        listId={listId}
        existingContactIds={new Set(contacts?.map((c) => c.contactId) ?? [])}
      />
    </div>
  );
}

function AddContactsModal({
  open,
  onClose,
  listId,
  existingContactIds,
}: {
  open: boolean;
  onClose: () => void;
  listId: string;
  existingContactIds: Set<string>;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const addContacts = useAddContactsToList();

  const { data, isLoading } = useContacts({ page: 0, size: 200, search: search || undefined });

  const available = useMemo(
    () => (data?.contacts ?? []).filter((c) => !existingContactIds.has(c.id)),
    [data, existingContactIds],
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === available.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(available.map((c) => c.id)));
    }
  };

  const handleAdd = async () => {
    if (selected.size === 0) return;
    await addContacts.mutateAsync({ listId, contactIds: Array.from(selected) });
    setSelected(new Set());
    onClose();
  };

  const handleClose = () => {
    setSelected(new Set());
    setSearch("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Contacts to List</DialogTitle>
        </DialogHeader>

        <div className="flex gap-1.5 mt-1">
          <Input
            placeholder="Search contacts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button size="icon" variant="outline" aria-label="Search">
            <HugeiconsIcon icon={Search01Icon} size={15} />
          </Button>
        </div>

        <div className="border border-border rounded-[var(--radius)] overflow-hidden">
          {/* Select all header */}
          {available.length > 0 && (
            <div
              className="flex items-center gap-3 px-3 py-2.5 bg-muted/40 border-b border-border cursor-pointer hover:bg-muted/60 transition-colors"
              onClick={toggleAll}
            >
              <Checkbox
                checked={selected.size === available.length && available.length > 0}
                onCheckedChange={toggleAll}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-xs font-medium text-muted-foreground">
                {selected.size > 0 ? `${selected.size} selected` : "Select all"}
              </span>
            </div>
          )}

          {/* Contact list */}
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <HugeiconsIcon icon={Loading03Icon} size={20} className="animate-spin text-muted-foreground" />
              </div>
            ) : available.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-10">
                {search ? "No contacts match your search." : "All contacts are already in this list."}
              </p>
            ) : (
              available.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 px-3 py-2.5 border-b border-border/50 last:border-0 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => toggle(contact.id)}
                >
                  <Checkbox
                    checked={selected.has(contact.id)}
                    onCheckedChange={() => toggle(contact.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{contact.email}</p>
                    {(contact.firstName || contact.lastName) && (
                      <p className="text-xs text-muted-foreground truncate">
                        {[contact.firstName, contact.lastName].filter(Boolean).join(" ")}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleAdd}
            disabled={selected.size === 0 || addContacts.isPending}
          >
            {addContacts.isPending ? "Adding…" : `Add ${selected.size > 0 ? selected.size : ""} Contact${selected.size !== 1 ? "s" : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
