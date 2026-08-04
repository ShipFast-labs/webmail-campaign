import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      className="relative min-h-svh flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Diagonal cross grid with radial mask — fades from bottom up */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, var(--pattern-line) 49%, var(--pattern-line) 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, var(--pattern-line) 49%, var(--pattern-line) 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)",
          maskImage: "radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)",
        }}
      />

      {/* Drifting coral orbs */}

      {/* Edge fades so content stays readable */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, oklch(from var(--background) l c h / 0.7) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, var(--background), transparent)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
      />

      {/* Content */}
      <div className="relative max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-sm font-semibold tracking-[0.12em] uppercase text-primary mb-6"
        >
          Email marketing platform
        </motion.p>

        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold leading-[1.06] tracking-[-0.035em] text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display)",
          }}
        >
          Email campaigns
          <br className="hidden sm:block" /> that deliver.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-[52ch] mx-auto leading-relaxed"
        >
          Build, send, and track campaigns to your contact lists. Real-time analytics show you what
          worked.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex items-center justify-center gap-3 flex-wrap"
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <Button asChild size="lg" className="rounded-full px-9">
              <Link to="/register">Start free</Link>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <Button asChild size="lg" variant="outline" className="rounded-full px-9">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        aria-hidden
      >
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-transparent via-border to-transparent"
          animate={{ scaleY: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
