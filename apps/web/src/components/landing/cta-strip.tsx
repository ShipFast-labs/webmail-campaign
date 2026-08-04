import { motion } from "motion/react"
import { Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

export function CtaStrip() {
  return (
    <section
      className="relative px-6 py-32 overflow-hidden"
      aria-labelledby="cta-heading"
      style={{
        background:
          "linear-gradient(145deg, oklch(0.12 0.006 55) 0%, oklch(0.17 0.05 34) 45%, oklch(0.12 0.006 55) 100%)",
      }}
    >
      {/* Drifting orbs */}
      <motion.div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          top: "-10%",
          left: "30%",
          width: 340,
          height: 340,
          background: "oklch(0.58 0.18 32 / 0.22)",
          filter: "blur(90px)",
        }}
        animate={{ x: [0, 40, -20, 0], y: [0, 30, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          bottom: "-10%",
          right: "20%",
          width: 260,
          height: 260,
          background: "oklch(0.58 0.18 32 / 0.15)",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, -30, 20, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(1 0 0 / 0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className="relative max-w-2xl mx-auto text-center">
        <motion.h2
          id="cta-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold tracking-tight mb-6"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display-s)",
            color: "oklch(0.96 0.003 60)",
          }}
        >
          Build your first campaign.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-base mb-10"
          style={{ color: "oklch(0.75 0.005 58)" }}
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
          <Button
            asChild
            size="lg"
            className="rounded-full px-10 font-semibold"
            style={{
              backgroundColor: "oklch(0.96 0.003 60)",
              color: "oklch(0.12 0.006 55)",
            }}
          >
            <Link to="/register">Start free</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
