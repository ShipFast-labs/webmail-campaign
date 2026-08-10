import { Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

const FEATURES = [
  "Build campaigns and send to your full list in one step.",
  "Open and click tracking with real-time delivery data.",
  "Dual email providers with automatic failover.",
];

export function BrandPanel() {
  return (
    <div
      className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between p-12"
      style={{ backgroundColor: "var(--color-forest-ink)" }}
    >
      {/* Logo lockup */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className="flex items-center justify-center w-9 h-9 rounded-md text-base font-extrabold"
          style={{
            backgroundColor: "var(--color-highlighter-yellow)",
            color: "var(--color-forest-ink)",
            fontFamily: "var(--font-display)",
          }}
        >
          C
        </span>
        <span
          className="font-bold text-lg"
          style={{
            color: "var(--color-cream-paper)",
            fontFamily: "var(--font-wordmark)",
          }}
        >
          Campaign
        </span>
      </motion.div>

      {/* Headline + features */}
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="leading-snug"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(2rem, 3vw + 1rem, 2.75rem)",
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            color: "var(--color-cream-paper)",
          }}
        >
          Email marketing{" "}
          <span
            style={{
              backgroundColor: "var(--color-highlighter-yellow)",
              color: "var(--color-forest-ink)",
              padding: "0 0.1em",
            }}
          >
            that works.
          </span>
        </p>

        <ul className="space-y-3">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm" style={{ color: "rgba(252,250,245,0.65)" }}>
              <HugeiconsIcon
                icon={Tick01Icon}
                size={16}
                className="mt-0.5 shrink-0"
                style={{ color: "var(--color-highlighter-yellow)" }}
              />
              {f}
            </li>
          ))}
        </ul>
      </motion.div>

      <p className="text-xs" style={{ color: "rgba(252,250,245,0.3)", fontFamily: "var(--font-mono)" }}>
        &copy; {new Date().getFullYear()} Campaign
      </p>
    </div>
  );
}
