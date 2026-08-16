import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTemplates, useCreateTemplate, useDeleteTemplate, useDuplicateTemplate } from "@/hooks/use-templates";
import { Button } from "@/components/ui/button";
import { PlusSignIcon, PaintBoardIcon, Delete02Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/templates/")({
  component: TemplatesPage,
});

function TemplatesPage() {
  const { data: templates, isLoading } = useTemplates();
  const deleteTemplate = useDeleteTemplate();
  const duplicateTemplate = useDuplicateTemplate();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground mt-1">Design and manage your email HTML templates.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <HugeiconsIcon icon={PlusSignIcon} size={16} className="mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-0 overflow-hidden flex flex-col">
              <Skeleton className="h-32 w-full rounded-none" />
              <div className="p-4 flex flex-col gap-2 bg-card">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))
        ) : templates?.length === 0 ? (
          <div className="col-span-3 text-center py-20 bg-card rounded-xl border border-dashed">
            <HugeiconsIcon icon={PaintBoardIcon} size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No templates yet</h3>
            <p className="text-muted-foreground">Create your first HTML template to get started.</p>
            <Button onClick={() => setIsCreateOpen(true)} className="mt-4" variant="outline">Create Template</Button>
          </div>
        ) : (
          templates?.map((tpl) => (
            <Card key={tpl.id} className="group relative hover:border-primary/50 transition-colors">
              <Link to="/templates/$templateId" params={{ templateId: tpl.id }} className="absolute inset-0 z-0" />
              <div className="p-3 flex flex-col gap-1 relative z-10 pointer-events-none">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold line-clamp-1 text-sm">{tpl.name}</h3>
                  <div className="flex gap-0.5 shrink-0 pointer-events-auto">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={(e) => { e.preventDefault(); duplicateTemplate.mutate(tpl.id); }}>
                      <HugeiconsIcon icon={Copy01Icon} size={13} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={(e) => { e.preventDefault(); deleteTemplate.mutate(tpl.id); }}>
                      <HugeiconsIcon icon={Delete02Icon} size={13} />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {tpl.subject || <span className="italic">No subject</span>}
                </p>
                {tpl.htmlContent && (
                  <p className="text-xs text-muted-foreground/50 line-clamp-2 leading-relaxed pt-1.5 border-t mt-0.5">
                    {tpl.htmlContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 140)}
                  </p>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
      
      <CreateTemplateModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}

function CreateTemplateModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [name, setName] = useState("");
  const createTemplate = useCreateTemplate();
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) return;
    const tpl = await createTemplate.mutateAsync({ name });
    setName("");
    onClose();
    navigate({ to: "/templates/$templateId", params: { templateId: tpl.id } });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new template</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="name">Template Name</Label>
          <Input 
            id="name" 
            placeholder="e.g. Welcome Email v2" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="mt-2" 
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!name.trim() || createTemplate.isPending}>
            {createTemplate.isPending ? "Creating..." : "Create Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
