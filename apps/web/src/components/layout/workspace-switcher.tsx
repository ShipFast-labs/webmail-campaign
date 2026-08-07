import { Building01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAuthStore } from "@/store/auth-store";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WorkspaceSwitcher() {
  const { workspace, setWorkspace } = useAuthStore();
  const { data: workspaces } = useWorkspaces();
  const qc = useQueryClient();

  const handleSelect = (ws: typeof workspace) => {
    if (!ws || ws.id === workspace?.id) return;
    setWorkspace(ws);
    qc.invalidateQueries();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 max-w-[180px] h-8 text-xs focus-visible:ring-2"
        >
          <HugeiconsIcon icon={Building01Icon} size={13} className="shrink-0 text-muted-foreground" />
          <span className="truncate font-medium">{workspace?.name ?? "Workspace"}</span>
          <HugeiconsIcon icon={ArrowDown01Icon} size={12} className="shrink-0 text-muted-foreground ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Switch workspace
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces?.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => handleSelect(ws)}
            className={cn(
              "gap-2 text-sm cursor-pointer",
              ws.id === workspace?.id && "bg-accent text-accent-foreground"
            )}
          >
            <HugeiconsIcon icon={Building01Icon} size={13} className="shrink-0 text-muted-foreground" />
            <span className="truncate">{ws.name}</span>
            {ws.id === workspace?.id && (
              <span className="ml-auto text-xs text-muted-foreground">active</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
