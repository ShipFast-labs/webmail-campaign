import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export function CtaStrip() {
  return (
    <section
      className="relative px-6 py-28 overflow-hidden"
      aria-labelledby="cta-heading"
      style={{ backgroundColor: "var(--color-forest-ink)" }}
    >
      {/* White dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">

        <motion.h2
          id="cta-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(2.5rem, 7vw + 1rem, 5.5rem)",
            letterSpacing: "0.04em",
            lineHeight: 1.05,
            color: "var(--color-cream-paper)",
          }}
        >
          Build your first{" "}
          <span style={{ backgroundColor: "var(--color-highlighter-yellow)", color: "var(--color-forest-ink)", padding: "0 0.1em" }}>
            campaign.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-base mb-10"
          style={{ color: "rgba(252,250,245,0.55)" }}
        >
          Create an account. Import your contacts. Send your first campaign today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Inverted CTA — yellow fill on dark band */}
          <Button
            asChild
            size="lg"
            className="rounded-md px-10 font-semibold"
            style={{
              backgroundColor: "var(--color-highlighter-yellow)",
              color: "var(--color-forest-ink)",
              border: "none",
            }}
          >
            <Link to="/register">Start</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
