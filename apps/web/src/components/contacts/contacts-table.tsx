import { useLegacyTable, getCoreRowModel, legacyCreateColumnHelper } from "@tanstack/react-table/legacy";
import { flexRender } from "@tanstack/react-table";
import { PencilEdit01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import type { Contact } from "@/api/contacts";
import { useDeleteContact } from "@/hooks/use-contacts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  UNSUBSCRIBED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  BOUNCED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  CLEANED: "bg-muted text-muted-foreground",
};

const col = legacyCreateColumnHelper<Contact>();

interface Props {
  contacts: Contact[];
  isLoading: boolean;
  isFetching?: boolean;
  page?: number;
  onEdit: (contact: Contact) => void;
}

export function ContactsTable({ contacts, isLoading, isFetching, page = 0, onEdit }: Props) {
  const deleteContact = useDeleteContact();

  const columns = col.columns([
    col.accessor("email", { header: "Email" }),
    col.accessor(
      (r) => [r.firstName, r.lastName].filter(Boolean).join(" ") || "—",
      { id: "name", header: "Name" }
    ),
    col.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[info.getValue()]}`}>
          {info.getValue()}
        </span>
      ),
    }),
    col.accessor("tags", {
      header: "Tags",
      cell: (info) => (
        <div className="flex flex-wrap gap-1">
          {(info.getValue() ?? []).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      ),
    }),
    col.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.15 }}>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(row.original)}>
              <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.15 }}>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => deleteContact.mutate(row.original.id)}
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
            </Button>
          </motion.div>
        </div>
      ),
    }),
  ]);

  const table = useLegacyTable({
    data: contacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <Card className={`overflow-hidden transition-opacity duration-200 ${isFetching && !isLoading ? "opacity-60" : "opacity-100"}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border/60">
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="text-left font-medium px-4 py-3 text-muted-foreground whitespace-nowrap"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <AnimatePresence mode="wait">
            <motion.tbody
              key={isLoading ? "loading" : page}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
            >
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
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
                    No contacts found
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
  );
}
