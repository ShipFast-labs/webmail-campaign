import { Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";

export function TopBar() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();
  const user = useAuthStore((s) => s.user);

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <header className="sticky top-0 z-20 flex items-center h-14 px-4 gap-3 border-b border-border bg-background/90 backdrop-blur-sm shrink-0">
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

      <ModeToggle />

      <div
        className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-semibold text-primary select-none cursor-default"
        title={user?.email}
      >
        {initials}
      </div>
    </header>
  );
}
