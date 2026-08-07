import { useState } from "react";
import { Tick01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { useAuthStore } from "@/store/auth-store";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const { workspace, setWorkspace } = useAuthStore();
  const { data: workspaces, isLoading } = useWorkspaces();
  const qc = useQueryClient();

  const handleSelect = (ws: typeof workspace) => {
    if (!ws || ws.id === workspace?.id) return;
    setWorkspace(ws);
    qc.invalidateQueries();
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 h-8 text-xs focus-visible:ring-2"
        onClick={() => setOpen(true)}
      >
        <span className="truncate font-medium">{workspace?.name ?? "Workspace"}</span>
        <HugeiconsIcon icon={ArrowDown01Icon} size={12} className="shrink-0 text-muted-foreground" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm p-0 overflow-hidden gap-0">
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-border/60">
            <DialogTitle className="text-sm font-semibold">Switch Workspace</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col p-2">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <Skeleton className="w-8 h-8 rounded-md shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))
            ) : !workspaces?.length ? (
              <p className="text-sm text-muted-foreground text-center py-6">No workspaces found</p>
            ) : (
              workspaces.map((ws, i) => {
                const isActive = ws.id === workspace?.id;
                return (
                  <motion.button
                    key={ws.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: i * 0.04 }}
                    onClick={() => handleSelect(ws)}
                    className={cn(
                      "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                      isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted/60 text-foreground"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-md text-xs font-bold shrink-0",
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {ws.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{ws.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{ws.role?.toLowerCase()}</p>
                    </div>
                    {isActive && (
                      <HugeiconsIcon icon={Tick01Icon} size={15} className="shrink-0 text-primary" />
                    )}
                  </motion.button>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
