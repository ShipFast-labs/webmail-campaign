import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { RoughNotation } from "react-rough-notation";

interface Chip {
  label: string;
  value: string;
  delay: number;
}

const CHIPS: Chip[] = [
  { label: "Open rate", value: "28.4%", delay: 0.6 },
  { label: "Sent today", value: "12,400", delay: 0.9 },
  { label: "Clicks", value: "1,248", delay: 1.1 },
  { label: "Bounce rate", value: "0.9%", delay: 1.3 },
];

function StatChip({ label, value, delay }: Chip) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3 + delay * 0.5, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-2xl px-4 py-3 bg-card border border-border shadow-sm min-w-[120px]"
      >
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
        <p
          className="text-xl font-bold text-foreground mt-0.5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {value}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const [showHighlight, setShowHighlight] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHighlight(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-svh flex items-center justify-center px-6 pt-20 pb-16 overflow-x-clip"
      aria-labelledby="hero-heading"
    >
      {/* Floating chips — visible xl+ only, flanking the centered content */}
      <div className="hidden xl:flex absolute inset-0 items-center justify-between pointer-events-none px-10 z-0">
        <div className="flex flex-col gap-5">
          <StatChip {...CHIPS[0]} />
          <StatChip {...CHIPS[2]} />
        </div>
        <div className="flex flex-col gap-5 items-end">
          <StatChip {...CHIPS[1]} />
          <StatChip {...CHIPS[3]} />
        </div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 max-w-3xl mx-auto text-center"
        style={{ overflowWrap: "anywhere", minWidth: 0 }}
      >
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-sm font-semibold tracking-[0.15em] uppercase text-primary mb-8"
        >
          Email marketing platform
        </motion.p>

        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-foreground"
          style={{
            fontFamily: "var(--font-heavy)",
            fontSize: "clamp(3.5rem, 9vw + 1rem, 8rem)",
            letterSpacing: "0.02em",
            lineHeight: 0.95,
            overflowWrap: "anywhere",
            minWidth: 0,
          }}
        >
          EMAIL <span style={{ color: "var(--primary)" }}>CAMPAIGNS</span>
          <br className="hidden sm:block" /> THAT{" "}
          <RoughNotation
            type="highlight"
            show={showHighlight}
            color="oklch(0.6368 0.2078 25.3313 / 0.45)"
            animationDuration={700}
            strokeWidth={3}
          >
            DELIVER
          </RoughNotation>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-[50ch] mx-auto leading-relaxed"
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
    </section>
  );
}
