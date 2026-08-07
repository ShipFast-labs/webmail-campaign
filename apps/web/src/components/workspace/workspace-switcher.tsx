import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Building01Icon, ArrowDown01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth-store";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { CreateWorkspaceModal } from "./create-workspace-modal";
import { cn } from "@/lib/utils";

interface WorkspaceSwitcherProps {
  collapsed?: boolean;
}

export function WorkspaceSwitcher({ collapsed }: WorkspaceSwitcherProps) {
  const { workspace: activeWorkspace, setWorkspace } = useAuthStore();
  const { data: workspaces, isLoading } = useWorkspaces();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex items-center gap-2 h-14 px-3 border-b border-sidebar-border shrink-0 hover:bg-sidebar-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full text-left",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-wordmark)" }}
            >
              C
            </span>
          </div>
          {!collapsed && (
            <div className="flex flex-1 flex-col justify-center min-w-0">
              <span
                className="font-semibold text-sm text-sidebar-foreground truncate leading-tight"
                style={{ fontFamily: "var(--font-wordmark)" }}
              >
                Campaign
              </span>
              <span className="text-xs text-sidebar-foreground/60 truncate flex items-center gap-1 leading-tight">
                {isLoading ? "Loading..." : activeWorkspace?.name || "Select Workspace"}
                <HugeiconsIcon icon={ArrowDown01Icon} size={12} className="ml-auto opacity-50 shrink-0" />
              </span>
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60 max-w-[calc(100vw-2rem)]">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {workspaces?.map((ws) => (
            <DropdownMenuItem
              key={ws.id}
              onClick={() => setWorkspace(ws)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <HugeiconsIcon icon={Building01Icon} size={16} className="shrink-0 text-muted-foreground" />
              <span className="truncate flex-1">{ws.name}</span>
              {activeWorkspace?.id === ws.id && (
                <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
          {workspaces?.length === 0 && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">No workspaces found</div>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer text-primary"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-primary/20 bg-primary/10 shrink-0">
              <HugeiconsIcon icon={PlusSignIcon} size={14} />
            </div>
            <span>Create Workspace</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateWorkspaceModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
