import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      className="relative min-h-screen w-full flex items-center px-6 pt-32 pb-20 overflow-hidden"
      aria-labelledby="hero-heading"
      style={{ backgroundColor: "var(--color-mm-cream-paper)" }}
    >
      {/* Top Fade Grid Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="max-w-4xl">
          {/* Display headline */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "var(--mm-text-display)",
              letterSpacing: "var(--mm-tracking-display)",
              lineHeight: "var(--mm-leading-display)",
              color: "var(--color-mm-ink-black)",
            }}
          >
            Email campaigns{" "}
            <br className="hidden sm:block" />
            that{" "}
            <span style={{ color: "var(--color-mm-fresh-grass)" }}>
              Deliver
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 mb-10 max-w-[46ch] leading-relaxed"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "18px",
              color: "var(--color-mm-ink-black)",
              opacity: 0.8
            }}
          >
            Build, send, and track campaigns to your contact lists. Real-time analytics show you
            what worked.
          </motion.p>

          {/* CTA group */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-6 flex-wrap"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
              <Button
                asChild
                className="rounded-full h-14 px-8 font-medium flex items-center gap-3 group relative overflow-hidden transition-transform"
                style={{
                  backgroundColor: "var(--color-mm-pure-white)",
                  color: "var(--color-mm-ink-black)",
                  border: "1.5px solid var(--color-mm-ink-black)",
                  fontSize: "17px"
                }}
              >
                <Link to="/register">
                  Get started
                </Link>
              </Button>
            </motion.div>

            <motion.a
              href="#how-it-works"
              className="font-medium hover:opacity-70 transition-opacity"
              style={{
                color: "var(--color-mm-stone-gray)",
                fontSize: "16px",
                borderBottom: "1px solid var(--color-mm-stone-gray)",
                paddingBottom: "2px"
              }}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              How it works
            </motion.a>
          </motion.div>
        </div>

        {/* Accent strip bleeding from bottom */}
        <motion.div
          className="absolute -bottom-32 right-0 hidden lg:flex items-end gap-3 rotate-6 opacity-90 pointer-events-none"
          initial={{ opacity: 0, y: 100, rotate: 12 }}
          animate={{ opacity: 0.9, y: 0, rotate: 6 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-16 h-48 rounded-full" style={{ backgroundColor: "var(--color-mm-fresh-grass)", border: "1.5px solid var(--color-mm-ink-black)" }} />
          <div className="w-16 h-64 rounded-full" style={{ backgroundColor: "var(--color-mm-coral-pop)", border: "1.5px solid var(--color-mm-ink-black)" }} />
          <div className="w-16 h-40 rounded-full" style={{ backgroundColor: "var(--color-mm-sunshine-pop)", border: "1.5px solid var(--color-mm-ink-black)" }} />
        </motion.div>
      </div>
    </section>
  );
}
