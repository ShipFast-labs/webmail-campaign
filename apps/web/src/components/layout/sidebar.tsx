import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft01Icon, Logout01Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { SidebarNav } from "./sidebar-nav";
import { authService } from "@/lib/auth-service";
import { NamiSendLogo } from "@/components/ui/namis-end-logo";

export function Sidebar() {
  const navigate = useNavigate();
  const { mobileSidebarOpen, sidebarCollapsed, setMobileSidebarOpen, toggleSidebarCollapsed } =
    useUiStore();
  const handleLogout = () => {
    authService.logout();
    navigate({ to: "/login" });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar border-r border-sidebar-border",
          "transition-[width,transform] duration-200 ease-in-out",
          "md:static md:translate-x-0 w-60",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          sidebarCollapsed && "md:w-[60px]",
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-14 px-3 border-b border-sidebar-border shrink-0">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 min-w-0 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <NamiSendLogo size={28} />
          </Link>
        </div>

        <SidebarNav collapsed={sidebarCollapsed} />

        {/* Footer */}
        <div className="px-2 py-3 border-t border-sidebar-border space-y-0.5 shrink-0">
          <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                sidebarCollapsed && "md:justify-center md:px-0",
              )}
              title={sidebarCollapsed ? "Settings" : undefined}
            >
              <Link to="/settings" onClick={() => setMobileSidebarOpen(false)}>
                <HugeiconsIcon
                  icon={Settings01Icon}
                  size={18}
                  className="shrink-0 text-sidebar-foreground/60"
                />
                <span className={cn(sidebarCollapsed && "md:hidden")}>Settings</span>
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10",
                sidebarCollapsed && "md:justify-center md:px-0",
              )}
              title={sidebarCollapsed ? "Sign out" : undefined}
            >
              <HugeiconsIcon icon={Logout01Icon} size={18} className="shrink-0" />
              <span className={cn(sidebarCollapsed && "md:hidden")}>Sign out</span>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="absolute -right-3 bottom-30 z-50 hidden md:block"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.15 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full bg-sidebar border-sidebar-border shadow-sm"
            onClick={toggleSidebarCollapsed}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <motion.span
              animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={12} />
            </motion.span>
          </Button>
        </motion.div>
      </aside>
    </>
  );
}
