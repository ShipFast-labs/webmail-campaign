import { Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";

export function TopBar() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();
  const user = useAuthStore((s) => s.user);

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <header className="sticky top-0 z-20 flex items-center h-14 px-4 gap-3 border-b border-sidebar-border bg-sidebar shrink-0">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        aria-label="Open menu"
      >
        <HugeiconsIcon icon={Menu01Icon} size={18} />
      </Button>

      <div className="flex-1" />

      <WorkspaceSwitcher />
      <ModeToggle />

      <Avatar className="h-8 w-8 cursor-pointer" title={user?.email}>
        <AvatarImage src={user?.avatarUrl} alt={user?.fullName || user?.email} referrerPolicy="no-referrer" />
        <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold select-none">
          {initials}
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
