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
      <h2 id="features-heading" className="sr-only">
        Features
      </h2>

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
            style={{ transition: "box-shadow 0.3s, border-color 0.3s" }}
          >
            {/* Hover glow fill */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, oklch(0.58 0.18 32 / 0.08), transparent 70%)",
                transition: "opacity 0.35s",
              }}
              aria-hidden
            />
            {/* Hover border glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100"
              style={{
                boxShadow: "0 0 0 1px oklch(0.58 0.18 32 / 0.35), 0 16px 40px oklch(0.58 0.18 32 / 0.12)",
                transition: "opacity 0.35s",
              }}
              aria-hidden
            />

            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/18">
              <HugeiconsIcon icon={icon} size={20} primaryColor="oklch(0.58 0.18 32)" strokeWidth={1.5} />
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
