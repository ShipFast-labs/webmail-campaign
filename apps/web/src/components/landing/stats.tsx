/**
 * Stats — Animated counter section for social proof.
 * Uses Framer Motion (not Remotion) since these are simple scroll-triggered counters.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { EASING } from "@/remotion/constants";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  prefix: string;
  decimals: number;
}

const STATS: StatItem[] = [
  {
    label: "Emails Processed",
    value: 10000,
    suffix: "+",
    prefix: "",
    decimals: 0,
  },
  {
    label: "Delivery Rate",
    value: 99.2,
    suffix: "%",
    prefix: "",
    decimals: 1,
  },
  {
    label: "Time to First Send",
    value: 3,
    suffix: " min",
    prefix: "< ",
    decimals: 0,
  },
];

function AnimatedCounter({
  item,
  isInView,
}: {
  item: StatItem;
  isInView: boolean;
}) {
  const [display, setDisplay] = useState("0");
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1800; // ms
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = EASING.easeOutCubic(rawProgress);

      const current = item.value * progress;
      setDisplay(
        item.decimals > 0
          ? current.toFixed(item.decimals)
          : Math.floor(current).toLocaleString(),
      );

      if (rawProgress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isInView, item.value, item.decimals]);

  return (
    <span>
      {item.prefix}
      {display}
      {item.suffix}
    </span>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative px-6 py-20 overflow-hidden"
      aria-label="Platform statistics"
      style={{ backgroundColor: "var(--color-forest-ink)" }}
    >
      {/* White dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(2.5rem, 6vw, 4rem)",
                  letterSpacing: "0.02em",
                  lineHeight: 1.1,
                  color: "var(--color-highlighter-yellow)",
                }}
              >
                <AnimatedCounter item={stat} isInView={isInView} />
              </div>
              <div
                className="mt-3"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                  color: "rgba(252,250,245,0.55)",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
