import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export function Nav() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        className="flex items-center gap-1 border bg-cream-paper px-3 py-2"
        style={{
          borderRadius: "16px",
          borderColor: "var(--color-pencil-gray)",
          boxShadow: "var(--shadow-sm)",
        }}
        aria-label="Main navigation"
      >
        {/* Logo lockup */}
        <Link
          to="/"
          className="flex items-center gap-2 px-1 py-1 mr-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Campaign home"
        >
          <span
            className="flex items-center justify-center w-8 h-8 rounded-md text-sm font-extrabold"
            style={{
              backgroundColor: "var(--color-highlighter-yellow)",
              color: "var(--color-forest-ink)",
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.02em",
            }}
          >
            C
          </span>
          <span
            className="hidden sm:block text-sm font-bold text-foreground"
            style={{ fontFamily: "var(--font-wordmark)" }}
          >
            Campaign
          </span>
        </Link>

        {/* Nav links */}
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
              className="px-3 py-1.5 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors duration-150 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {label}
            </motion.a>
          ))}
        </div>

        <div className="hidden md:block w-px h-4 mx-2" style={{ backgroundColor: "var(--color-pencil-gray)" }} aria-hidden />

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button asChild size="sm" className="rounded-md">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden md:inline-flex rounded-md border-foreground/30 text-foreground hover:bg-accent/20"
              >
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="rounded-md">
                <Link to="/register">→ Start free</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
