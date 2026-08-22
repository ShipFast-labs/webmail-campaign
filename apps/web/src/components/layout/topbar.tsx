import { Menu01Icon, Coins01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";
import { useBalance } from "@/hooks/use-billing";
import { usePaywallStore } from "@/store/paywall-store";

export function TopBar() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();
  const user = useAuthStore((s) => s.user);
  const { data: balance } = useBalance();
  const openPaywall = usePaywallStore((s) => s.openPaywall);

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

      <button
        type="button"
        onClick={openPaywall}
        className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
        title="Buy email credits"
      >
        <HugeiconsIcon icon={Coins01Icon} size={14} className="text-amber-600 dark:text-amber-400" />
        {balance ? balance.credits.toLocaleString() : "…"} credits
      </button>

      <WorkspaceSwitcher />

      <Avatar className="h-8 w-8 cursor-pointer" title={user?.email}>
        <AvatarImage src={user?.avatarUrl} alt={user?.fullName || user?.email} referrerPolicy="no-referrer" />
        <AvatarFallback className="bg-[#1a3300]/10 text-[#1a3300] text-xs font-semibold select-none">
          {initials}
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
