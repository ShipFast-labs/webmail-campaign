import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLists, useCreateList, useDeleteList, useUpdateList } from "@/hooks/use-lists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  PlusSignIcon, Delete02Icon, PencilEdit01Icon,
  Search01Icon, UserMultiple02Icon, Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { AudienceList } from "@/api/lists";

export const Route = createFileRoute("/_app/lists/")({
  component: ListsPage,
});

function ListsPage() {
  const { data: lists, isLoading } = useLists();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<AudienceList | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return lists ?? [];
    return (lists ?? []).filter((l) => l.name.toLowerCase().includes(search.toLowerCase()));
  }, [lists, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Audience Lists</h1>
          <p className="text-sm text-muted-foreground">
            {lists !== undefined ? `${lists.length} list${lists.length !== 1 ? "s" : ""}` : "Loading…"}
          </p>
        </div>
        <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
          <Button onClick={() => setIsCreateOpen(true)}>
            <HugeiconsIcon icon={PlusSignIcon} size={15} />
            New List
          </Button>
        </motion.div>
      </div>

      <div className="flex gap-1.5 max-w-sm">
        <Input
          placeholder="Search lists…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button size="icon" variant="outline" aria-label="Search">
          <HugeiconsIcon icon={Search01Icon} size={15} />
        </Button>
      </div>

      <motion.div
        key="data"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
      >
        <div className="border rounded-md bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b transition-colors">
                  <th className="h-10 px-4 py-3 text-left align-middle font-medium whitespace-nowrap text-foreground">Name</th>
                  <th className="h-10 px-4 py-3 text-left align-middle font-medium whitespace-nowrap text-foreground">Contacts</th>
                  <th className="h-10 px-4 py-3 text-left align-middle font-medium whitespace-nowrap text-foreground">Created</th>
                  <th className="h-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b transition-colors">
                      <td className="p-4 align-middle whitespace-nowrap"><Skeleton className="h-4 w-[140px]" /></td>
                      <td className="p-4 align-middle whitespace-nowrap"><Skeleton className="h-4 w-[60px]" /></td>
                      <td className="p-4 align-middle whitespace-nowrap"><Skeleton className="h-4 w-[90px]" /></td>
                      <td className="p-4 align-middle whitespace-nowrap">
                        <div className="flex justify-end gap-1">
                          <Skeleton className="h-7 w-7 rounded-md" />
                          <Skeleton className="h-7 w-7 rounded-md" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-20 text-muted-foreground">
                      <HugeiconsIcon icon={UserMultiple02Icon} size={32} className="mx-auto mb-3 opacity-40" />
                      <p>{search ? "No lists match your search." : "No lists yet. Create one to get started."}</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((list, i) => (
                    <ListRow
                      key={list.id}
                      list={list}
                      index={i}
                      onRename={() => setRenameTarget(list)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      <CreateListModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <RenameListModal list={renameTarget} onClose={() => setRenameTarget(null)} />
    </div>
  );
}

function ListRow({ list, index, onRename }: { list: AudienceList; index: number; onRename: () => void }) {
  const deleteList = useDeleteList();
  const navigate = useNavigate();

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12, delay: index * 0.02 }}
      className="border-b transition-colors hover:bg-muted/50 last:border-0 cursor-pointer"
      onClick={() => navigate({ to: "/lists/$listId", params: { listId: list.id } })}
    >
      <td className="p-4 align-middle whitespace-nowrap font-medium">{list.name}</td>
      <td className="p-4 align-middle whitespace-nowrap">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <HugeiconsIcon icon={UserMultiple02Icon} size={14} />
          {list.contactCount.toLocaleString()}
        </span>
      </td>
      <td className="p-4 align-middle whitespace-nowrap text-muted-foreground">
        {new Date(list.createdAt).toLocaleDateString()}
      </td>
      <td className="p-4 align-middle whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1 justify-end">
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.15 }}>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={onRename}>
              <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.15 }}>
            <Button
              variant="ghost" size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => deleteList.mutate(list.id)}
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
            </Button>
          </motion.div>
        </div>
      </td>
    </motion.tr>
  );
}

function CreateListModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const createList = useCreateList();

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createList.mutateAsync(name);
    setName("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new list</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="list-name">List Name</Label>
          <Input
            id="list-name"
            placeholder="e.g. VIP Customers"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!name.trim() || createList.isPending}>
            {createList.isPending ? "Creating…" : "Create List"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RenameListModal({ list, onClose }: { list: AudienceList | null; onClose: () => void }) {
  const [name, setName] = useState("");
  const updateList = useUpdateList();

  useEffect(() => {
    if (list) setName(list.name);
  }, [list]);

  const handleSave = async () => {
    if (!name.trim() || !list) return;
    await updateList.mutateAsync({ id: list.id, name });
    onClose();
  };

  return (
    <Dialog open={!!list} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename list</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="rename-name">List Name</Label>
          <Input
            id="rename-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim() || updateList.isPending}>
            {updateList.isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
