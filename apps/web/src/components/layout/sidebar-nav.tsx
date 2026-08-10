import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChartAnalysisIcon,
  Home01Icon,
  Layout02Icon,
  Mail01Icon,
  UserGroupIcon,
  UserListIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: Home01Icon },
  { to: "/campaigns", label: "Campaigns", icon: Mail01Icon },
  { to: "/contacts", label: "Contacts", icon: UserGroupIcon },
  { to: "/lists", label: "Lists", icon: UserListIcon },
  { to: "/templates", label: "Templates", icon: Layout02Icon },
  { to: "/analytics", label: "Analytics", icon: ChartAnalysisIcon },
] as const;

import { useAuthStore } from "@/store/auth-store";

type NavItemProps = {
  to: string;
  label: string;
  icon: (typeof NAV_ITEMS)[number]["icon"];
  active: boolean;
  collapsed: boolean;
  workspaceId?: string;
};

function NavItem({ to, label, icon, active, collapsed, workspaceId }: NavItemProps) {
  const { setMobileSidebarOpen } = useUiStore();

  return (
    <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15, ease: "easeOut" }}>
      <Link
        to={to as string}
        search={{ workspace: workspaceId } as Record<string, string | undefined>}
        onClick={() => setMobileSidebarOpen(false)}
        className={cn(
          "flex items-center gap-3 h-9 px-2.5 rounded-md text-sm font-medium transition-colors",
          "focus-visible:outline-none",
          active
            ? "bg-accent/25 text-foreground font-semibold"
            : "text-foreground/55 hover:text-foreground hover:bg-accent/15",
          collapsed && "md:justify-center md:px-0",
        )}
        title={collapsed ? label : undefined}
      >
        <HugeiconsIcon
          icon={icon}
          size={18}
          className={cn("shrink-0", active ? "text-foreground" : "text-foreground/50")}
        />
        <span className={cn("truncate", collapsed && "md:hidden")}>{label}</span>
      </Link>
    </motion.div>
  );
}

export function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const workspace = useAuthStore((s) => s.workspace);

  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-0.5">
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <NavItem
          key={to}
          to={to}
          label={label}
          icon={icon}
          active={pathname.startsWith(to)}
          collapsed={collapsed}
          workspaceId={workspace?.id}
        />
      ))}
    </nav>
  );
}
