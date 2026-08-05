import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { useAuthStore } from "@/store/auth-store";

const APP_NAME = "Campaign"; // TODO: replace with product name

const DEV_SEED = import.meta.env.DEV;

export function Nav() {
  const navigate = useNavigate();

  function enterDevPreview() {
    useAuthStore.getState().setAuth({
      user: { id: "dev-user", email: "dev@campaign.app", fullName: "Dev User", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      workspace: { id: "dev-ws", name: "Demo workspace", ownerId: "dev-user", role: "ADMIN", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      accessToken: "dev-token",
      refreshToken: "dev-refresh",
    });
    navigate({ to: "/dashboard" });
  }

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        className="flex items-center gap-1 rounded-full border border-border bg-background/85 px-3 py-2 shadow-sm"
        style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="px-2 py-1 mr-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`${APP_NAME} home`}
        >
          <span
            className="font-wordmark font-semibold text-base tracking-tight text-foreground select-none"
            style={{ fontFamily: "var(--font-wordmark)" }}
          >
            {APP_NAME}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1" role="list">
          {[
            { href: "#features", label: "Features" },
            { href: "#how-it-works", label: "How it works" },
            { href: "#faq", label: "FAQ" },
          ].map(({ href, label }) => (
            <motion.a
              key={href}
              href={href}
              role="listitem"
              className="relative px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              initial="rest"
              animate="rest"
              whileHover="hovered"
            >
              {label}
              <motion.span
                aria-hidden
                className="absolute bottom-0.5 left-3 right-3 h-px rounded-full"
                style={{ backgroundColor: "var(--primary)", transformOrigin: "left" }}
                variants={{
                  rest: { scaleX: 0, opacity: 0 },
                  hovered: { scaleX: 1, opacity: 1 },
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </motion.a>
          ))}
        </div>

        <div className="hidden md:block w-px h-4 bg-border mx-1" aria-hidden />

        <div className="flex items-center gap-1">
          {DEV_SEED && (
            <Button
              size="sm"
              variant="ghost"
              className="hidden md:flex rounded-full text-xs text-muted-foreground border border-dashed border-border"
              onClick={enterDevPreview}
            >
              Dev preview
            </Button>
          )}
          <Link
            to="/login"
            className="hidden md:block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          >
            Sign in
          </Link>
          <Button asChild size="sm" className="rounded-full">
            <Link to="/register">Start free</Link>
          </Button>
        </div>

        <ModeToggle />
      </nav>
    </header>
  );
}
