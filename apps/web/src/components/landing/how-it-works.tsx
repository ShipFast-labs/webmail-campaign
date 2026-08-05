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
      style={{ backgroundColor: "var(--band-violet)" }}
    >
      <div className="relative max-w-5xl mx-auto">
        <motion.h2
          id="how-it-works-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center"
          style={{
            fontFamily: "var(--font-heavy)",
            fontSize: "clamp(2.5rem, 5vw + 1rem, 5.5rem)",
            letterSpacing: "0.02em",
            lineHeight: 0.95,
            color: "oklch(1 0 0)",
            overflowWrap: "anywhere",
            minWidth: 0,
          }}
        >
          HOW IT WORKS.
        </motion.h2>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Connecting line — desktop only */}
          <motion.div
            aria-hidden
            className="hidden md:block absolute h-px"
            style={{
              top: "2.2rem",
              left: "calc(16.67% + 2rem)",
              right: "calc(16.67% + 2rem)",
              background:
                "linear-gradient(to right, transparent, oklch(1 0 0 / 0.3), oklch(1 0 0 / 0.3), transparent)",
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
                  fontFamily: "var(--font-heavy)",
                  color: "oklch(1 0 0 / 0.3)",
                  letterSpacing: "0.02em",
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
                className="font-semibold text-lg"
                style={{ color: "oklch(1 0 0)" }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(1 0 0 / 0.65)" }}>
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
