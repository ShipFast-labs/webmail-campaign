import { motion } from "motion/react";

interface Step {
  number: string;
  title: string;
  description: string;
  cardBg: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Import your contacts",
    description:
      "Upload a CSV file. Map your column headers to contact fields. We process in batches and show progress as it runs.",
    cardBg: "var(--color-sticky-note-mint)",
  },
  {
    number: "02",
    title: "Build your template",
    description:
      "Write your email in the template editor. Preview it with real contact data before you commit.",
    cardBg: "var(--color-sticky-note-teal)",
  },
  {
    number: "03",
    title: "Send and watch",
    description:
      "Schedule a campaign or send now. Analytics update as your audience opens and clicks.",
    cardBg: "var(--color-sticky-note-blush)",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative px-6 py-24 overflow-hidden"
      aria-labelledby="how-it-works-heading"
      style={{ backgroundColor: "var(--color-cream-paper)" }}
    >
      {/* Subtle dot texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-pencil-gray) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.18,
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Section heading */}
        <motion.h2
          id="how-it-works-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(2.5rem, 5vw + 1rem, 4.5rem)",
            letterSpacing: "0.04em",
            lineHeight: 1.05,
          }}
        >
          How it{" "}
          <span
            style={{
              backgroundColor: "var(--color-highlighter-yellow)",
              padding: "0 0.1em",
            }}
          >
            works.
          </span>
        </motion.h2>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">

          {/* Desktop connector — sits behind the cards, aligned to the badge row */}
          <div
            aria-hidden
            className="hidden md:block absolute"
            style={{
              top: "1.75rem",
              left: "calc(16.67% + 1.5rem)",
              right: "calc(16.67% + 1.5rem)",
              height: "1px",
              borderTop: "2px dashed var(--color-pencil-gray)",
              zIndex: 0,
            }}
          />

          {STEPS.map(({ number, title, description, cardBg }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="relative flex flex-col gap-5 rounded-xl p-6 cursor-default"
              style={{
                backgroundColor: cardBg,
                border: "1px solid var(--color-forest-ink)",
                zIndex: 1,
              }}
            >
              {/* Step badge */}
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-extrabold shrink-0"
                  style={{
                    backgroundColor: "var(--color-highlighter-yellow)",
                    color: "var(--color-forest-ink)",
                    border: "1.5px solid var(--color-forest-ink)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {number}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "var(--color-forest-ink)", opacity: 0.15 }}
                  aria-hidden
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3
                  className="font-semibold text-foreground"
                  style={{ fontSize: "17px", lineHeight: 1.3 }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-forest-ink)", opacity: 0.62 }}
                >
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
