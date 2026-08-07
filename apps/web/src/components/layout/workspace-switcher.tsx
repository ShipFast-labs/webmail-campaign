import { useState } from "react";
import { Tick01Icon, ArrowDown01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAuthStore } from "@/store/auth-store";
import { useWorkspaces, useCreateWorkspace } from "@/hooks/use-workspaces";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function WorkspaceSwitcher() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  
  const { workspace, setWorkspace } = useAuthStore();
  const { data: workspaces, isLoading } = useWorkspaces();
  const createWorkspace = useCreateWorkspace();
  const qc = useQueryClient();

  const handleSelect = (ws: typeof workspace) => {
    if (!ws || ws.id === workspace?.id) return;
    setWorkspace(ws);
    qc.invalidateQueries();
  };

  const handleCreate = async () => {
    if (!newWorkspaceName.trim()) return;
    await createWorkspace.mutateAsync(newWorkspaceName);
    setNewWorkspaceName("");
    setIsCreateOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 h-9 px-3 border-border/50 bg-background hover:bg-muted text-sm font-medium focus-visible:ring-1 focus-visible:ring-ring"
          >
            <div className="w-5 h-5 rounded-[4px] bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shrink-0">
              {workspace?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="truncate max-w-[120px]">{workspace?.name ?? "Workspace"}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="shrink-0 text-muted-foreground opacity-70 ml-1" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[240px] p-1">
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
            Workspaces
          </DropdownMenuLabel>
          
          {isLoading ? (
            <div className="p-2 text-sm text-muted-foreground">Loading...</div>
          ) : !workspaces?.length ? (
            <div className="p-2 text-sm text-muted-foreground">No workspaces found</div>
          ) : (
            workspaces.map((ws) => {
              const isActive = ws.id === workspace?.id;
              return (
                <DropdownMenuItem
                  key={ws.id}
                  onClick={() => handleSelect(ws)}
                  className="flex items-center gap-2 cursor-pointer rounded-md p-2"
                >
                  <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0",
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ws.name}</p>
                  </div>
                  {isActive && <HugeiconsIcon icon={Tick01Icon} size={14} className="text-primary shrink-0" />}
                </DropdownMenuItem>
              );
            })
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 cursor-pointer p-2 text-muted-foreground"
          >
            <div className="w-6 h-6 rounded bg-muted/50 border border-dashed flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={PlusSignIcon} size={12} />
            </div>
            <span className="text-sm font-medium">Create Workspace</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="ws-name">Workspace Name</Label>
            <Input 
              id="ws-name" 
              placeholder="e.g. Acme Corp" 
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              className="mt-2"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newWorkspaceName.trim() || createWorkspace.isPending}>
              {createWorkspace.isPending ? "Creating..." : "Create Workspace"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
