import { motion } from "motion/react"
import { Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

export function CtaStrip() {
  return (
    <section
      className="relative px-6 py-32 overflow-hidden"
      aria-labelledby="cta-heading"
      style={{ backgroundColor: "var(--band-dark)" }}
    >
      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(1 0 0 / 0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className="relative max-w-3xl mx-auto text-center" style={{ overflowWrap: "anywhere", minWidth: 0 }}>
        <motion.h2
          id="cta-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
          style={{
            fontFamily: "var(--font-heavy)",
            fontSize: "clamp(3rem, 8vw + 1rem, 7.5rem)",
            letterSpacing: "0.02em",
            lineHeight: 0.95,
            color: "oklch(1 0 0)",
          }}
        >
          BUILD YOUR<br />FIRST CAMPAIGN.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-base mb-10"
          style={{ color: "oklch(1 0 0 / 0.6)" }}
        >
          Create an account. Import your contacts. Send your first campaign today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button asChild size="lg" className="rounded-full px-10 font-semibold">
            <Link to="/register">Start free</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
