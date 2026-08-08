import { createFileRoute, Link } from "@tanstack/react-router";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useList, useListContacts, useRemoveContactFromList } from "@/hooks/use-lists";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft01Icon, PlusSignIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
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

const col = createColumnHelper<ListContact>();

function ListDetailPage() {
  const { listId } = Route.useParams();
  const { data: list, isLoading: isListLoading } = useList(listId);
  const { data: contacts, isLoading: isContactsLoading } = useListContacts(listId);
  const removeContact = useRemoveContactFromList();

  const columns = [
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
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => removeContact.mutate({ listId, contactId: row.original.id })}
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: contacts ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full pb-10">
      <div>
        <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-muted-foreground" asChild>
          <Link to="/lists">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-1" />
            Back to Lists
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          {isListLoading ? (
            <Skeleton className="h-9 w-64" />
          ) : (
            <h1 className="text-3xl font-bold tracking-tight">{list?.name}</h1>
          )}
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} size={16} className="mr-2" />
            Add Contacts
          </Button>
        </div>
      </div>

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
            <AnimatePresence mode="wait">
              <motion.tbody
                key={isContactsLoading ? "loading" : "data"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
              >
                {isContactsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/40">
                      {columns.map((_, j) => (
                        <td key={j} className="px-4 py-3.5">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-16 text-muted-foreground">
                      No contacts in this list yet.
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
              </motion.tbody>
            </AnimatePresence>
          </table>
        </div>
      </Card>
    </div>
  );
}
