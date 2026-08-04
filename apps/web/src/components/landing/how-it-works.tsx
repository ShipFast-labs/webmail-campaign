import { motion } from "motion/react"

interface Step {
  number: string
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Import your contacts",
    description:
      "Upload a CSV file. Map your column headers to contact fields. We process in batches and show progress as it runs.",
  },
  {
    number: "02",
    title: "Build your template",
    description:
      "Write your email in the template editor. Preview it with real contact data before you commit.",
  },
  {
    number: "03",
    title: "Send and watch",
    description:
      "Schedule a campaign or send now. Analytics update as your audience opens and clicks.",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative px-6 py-24 overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      {/* Section tint — cross pattern from body shows through */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "oklch(from var(--muted) l c h / 0.55)" }}
      />

      <div className="relative max-w-5xl mx-auto">
        <motion.h2
          id="how-it-works-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold text-foreground mb-20 text-center tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display-s)",
          }}
        >
          Three steps to your first campaign.
        </motion.h2>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Connecting line — desktop only */}
          <motion.div
            aria-hidden
            className="hidden md:block absolute h-px"
            style={{
              top: "2.6rem",
              left: "calc(16.67% + 2rem)",
              right: "calc(16.67% + 2rem)",
              background:
                "linear-gradient(to right, transparent, oklch(from var(--border) l c h / 0.8), oklch(from var(--border) l c h / 0.8), transparent)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />

          {STEPS.map(({ number, title, description }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <motion.span
                className="block text-5xl font-light select-none"
                style={{
                  fontFamily: "var(--font-wordmark)",
                  color: "oklch(0.58 0.18 32 / 0.35)",
                }}
                initial={{ opacity: 0, scale: 0.75 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.15 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden
              >
                {number}
              </motion.span>
              <h3
                className="font-semibold text-lg text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
