import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { PencilEdit01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import type { Contact } from "@/api/contacts";
import { useDeleteContact } from "@/hooks/use-contacts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  UNSUBSCRIBED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  BOUNCED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  CLEANED: "bg-muted text-muted-foreground",
};

const col = createColumnHelper<Contact>();

interface Props {
  contacts: Contact[];
  isLoading: boolean;
  isFetching?: boolean;
  onEdit: (contact: Contact) => void;
}

export function ContactsTable({ contacts, isLoading, isFetching, onEdit }: Props) {
  const deleteContact = useDeleteContact();

  const columns = [
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
  ];

  const table = useReactTable({
    data: contacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <Card className={`overflow-hidden transition-opacity duration-200 ${isFetching && !isLoading ? "opacity-60" : "opacity-100"}`}>
      <Table>
        <TableHeader className="bg-muted/40">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="border-b border-border/60 hover:bg-transparent">
              {hg.headers.map((h) => (
                <TableHead key={h.id} className="text-muted-foreground px-4 py-3 font-medium">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="wait">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <motion.tr
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="border-b border-border/40"
                >
                  {columns.map((_, j) => (
                    <TableCell key={j} className="px-4 py-3.5">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <motion.tr
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <TableCell colSpan={columns.length} className="text-center py-16 text-muted-foreground">
                  No contacts found
                </TableCell>
              </motion.tr>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03, ease: "easeOut" }}
                  className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </Card>
  );
}
