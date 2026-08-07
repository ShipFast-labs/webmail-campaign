import { createFileRoute, Link } from "@tanstack/react-router";
import { useLists, useCreateList, useDeleteList } from "@/hooks/use-lists";
import { Button } from "@/components/ui/button";
import { PlusSignIcon, Settings01Icon, UserMultiple02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/lists/")({
  component: ListsPage,
});

function ListsPage() {
  const { data: lists, isLoading } = useLists();
  const deleteList = useDeleteList();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6 h-full flex flex-col max-w-6xl mx-auto w-full pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audience Lists</h1>
          <p className="text-muted-foreground mt-1">Manage your subscriber lists for campaigns.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <HugeiconsIcon icon={PlusSignIcon} size={16} className="mr-2" />
          Create List
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-32 bg-muted/20 animate-pulse" />
          ))
        ) : lists?.length === 0 ? (
          <div className="col-span-3 text-center py-20 bg-card rounded-xl border border-dashed">
            <HugeiconsIcon icon={UserMultiple02Icon} size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No lists yet</h3>
            <p className="text-muted-foreground">Create your first audience list to get started.</p>
            <Button onClick={() => setIsCreateOpen(true)} className="mt-4" variant="outline">Create List</Button>
          </div>
        ) : (
          lists?.map((list) => (
            <Card key={list.id} className="p-5 flex flex-col group relative hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{list.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(list.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteList.mutate(list.id)}>
                    <HugeiconsIcon icon={Delete02Icon} size={16} />
                  </Button>
                </div>
              </div>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <div className="flex items-center text-sm font-medium">
                  <HugeiconsIcon icon={UserMultiple02Icon} size={16} className="mr-2 text-muted-foreground" />
                  {list.contactCount.toLocaleString()} Contacts
                </div>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/lists/$listId" params={{ listId: list.id }}>
                    View
                  </Link>
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
      
      <CreateListModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}

function CreateListModal({ open, onClose }: { open: boolean, onClose: () => void }) {
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
          <Label htmlFor="name">List Name</Label>
          <Input 
            id="name" 
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
            {createList.isPending ? "Creating..." : "Create List"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
