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
      className="hidden lg:flex w-[440px] shrink-0 flex-col justify-between p-12"
      style={{
        background: "linear-gradient(145deg, oklch(0.12 0.012 32), oklch(0.16 0.018 32))",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className="text-2xl font-bold text-primary"
          style={{ fontFamily: "var(--font-wordmark)" }}
        >
          Campaign
        </span>
      </motion.div>

      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="text-3xl font-semibold leading-snug text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Email marketing that works.
        </p>

        <ul className="space-y-3">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-white/70">
              <HugeiconsIcon icon={Tick01Icon} size={16} className="mt-0.5 shrink-0 text-primary" />
              {f}
            </li>
          ))}
        </ul>
      </motion.div>

      <p className="text-xs text-white/30">
        &copy; {new Date().getFullYear()} Campaign
      </p>
    </div>
  );
}
