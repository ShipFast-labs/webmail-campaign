import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      className="relative min-h-svh flex items-center justify-center px-6 pt-24 pb-20 overflow-x-clip"
      aria-labelledby="hero-heading"
    >
      {/* Warm grid texture — viewport-locked */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--pattern-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--pattern-line) 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage: "radial-gradient(ellipse 80% 65% at 50% 0%, #000 55%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 80% 65% at 50% 0%, #000 55%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-1.5 px-3 py-1 mb-8 rounded-full text-xs font-medium"
          style={{
            backgroundColor: "var(--color-highlighter-yellow)",
            color: "var(--color-forest-ink)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>✦</span>
          <span>Email campaigns that work</span>
        </motion.div>

        {/* Display headline */}
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(3rem, 8vw + 1rem, 5.5rem)",
            letterSpacing: "0.03em",
            lineHeight: 1.05,
          }}
        >
          Email campaigns{" "}
          <br className="hidden sm:block" />
          that{" "}
          <span
            style={{
              backgroundColor: "var(--color-highlighter-yellow)",
              padding: "0 0.12em",
              display: "inline",
            }}
          >
            deliver.
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 text-lg text-foreground/65 max-w-[52ch] mx-auto leading-relaxed"
        >
          Build, send, and track campaigns to your contact lists. Real-time analytics show you
          what worked.
        </motion.p>

        {/* CTA group */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex items-center justify-center gap-3 flex-wrap"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
            <Button asChild size="lg" className="rounded-md px-8 font-semibold">
              <Link to="/register">→ Start free</Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-md px-8 border-foreground/25 text-foreground hover:bg-accent/20"
            >
              <a href="#how-it-works">How it works</a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Reassurance */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-4 text-xs"
          style={{ color: "var(--color-pencil-gray)", fontFamily: "var(--font-mono)" }}
        >
          no credit card required.
        </motion.p>
      </div>
    </section>
  );
}
