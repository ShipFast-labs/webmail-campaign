import { ChartAnalysisIcon, Mail01Icon, UserListIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { motion } from "motion/react"

interface Feature {
  icon: IconSvgElement
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: Mail01Icon,
    title: "Send at scale",
    description:
      "Queue thousands of emails through a Kafka-powered pipeline. Rate limiting and retry logic come standard.",
  },
  {
    icon: UserListIcon,
    title: "Manage contacts",
    description:
      "Import contacts via CSV, organize into lists, and track status as bounces and unsubscribes arrive.",
  },
  {
    icon: ChartAnalysisIcon,
    title: "Track results",
    description:
      "Open rates, click rates, and bounce data update in real time. No waiting for next-day reports.",
  },
]

export function Features() {
  return (
    <section id="features" className="px-6 py-24 max-w-5xl mx-auto" aria-labelledby="features-heading">
      <motion.h2
        id="features-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="text-foreground mb-16 text-center"
        style={{
          fontFamily: "var(--font-heavy)",
          fontSize: "clamp(2.5rem, 5vw + 1rem, 5.5rem)",
          letterSpacing: "0.02em",
          lineHeight: 0.95,
          overflowWrap: "anywhere",
          minWidth: 0,
        }}
      >
        WHAT YOU GET.
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES.map(({ icon, title, description }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8 }}
            className="group relative rounded-2xl border border-border bg-card p-6 space-y-4 cursor-default overflow-hidden"
          >
            {/* Hover glow fill */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, color-mix(in oklch, var(--primary) 8%, transparent), transparent 70%)",
              }}
              aria-hidden
            />
            {/* Hover border glow */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow:
                  "0 0 0 1px color-mix(in oklch, var(--primary) 35%, transparent), 0 16px 40px color-mix(in oklch, var(--primary) 12%, transparent)",
              }}
              aria-hidden
            />

            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/18">
              <HugeiconsIcon icon={icon} size={20} primaryColor="var(--primary)" strokeWidth={1.5} />
            </div>

            <div className="relative space-y-2">
              <h3
                className="font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
