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
            <Card key={tpl.id} className="p-0 overflow-hidden flex flex-col group relative hover:border-primary/50 transition-colors">
              <div className="h-32 bg-muted flex items-center justify-center border-b relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 pointer-events-none opacity-90 bg-white"
                  style={{ width: '400%', height: '400%', transform: 'scale(0.25)', transformOrigin: 'top left' }}
                >
                  <iframe 
                    srcDoc={tpl.htmlContent}
                    className="w-full h-full border-0 pointer-events-none select-none"
                    tabIndex={-1}
                    sandbox=""
                  />
                </div>
                
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" asChild>
                    <Link to="/templates/$templateId" params={{ templateId: tpl.id }}>
                      Edit Template
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="p-4 flex items-start justify-between bg-card">
                <div>
                  <h3 className="font-semibold line-clamp-1">{tpl.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {tpl.subject}
                  </p>
                </div>
                <div className="flex gap-1 -mr-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => duplicateTemplate.mutate(tpl.id)}>
                    <HugeiconsIcon icon={Copy01Icon} size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteTemplate.mutate(tpl.id)}>
                    <HugeiconsIcon icon={Delete02Icon} size={14} />
                  </Button>
                </div>
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
