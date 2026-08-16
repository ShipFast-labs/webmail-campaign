import { ChartAnalysisIcon, Mail01Icon, UserListIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { motion } from "motion/react";
import { Suspense, lazy } from "react";
import { TIMING } from "@/remotion/constants";

const LazySendAtScale = lazy(() =>
  Promise.all([import("@remotion/player"), import("@/remotion/features/SendAtScaleDemo")]).then(
    ([playerModule, demoModule]) => ({
      default: () => (
        <playerModule.Player
          component={demoModule.SendAtScaleDemo}
          durationInFrames={TIMING.features.duration}
          compositionWidth={TIMING.features.width}
          compositionHeight={TIMING.features.height}
          fps={TIMING.fps}
          autoPlay
          loop
          style={{ width: "100%", height: "100%" }}
        />
      ),
    }),
  ),
);

const LazyManageContacts = lazy(() =>
  Promise.all([import("@remotion/player"), import("@/remotion/features/ManageContactsDemo")]).then(
    ([playerModule, demoModule]) => ({
      default: () => (
        <playerModule.Player
          component={demoModule.ManageContactsDemo}
          durationInFrames={TIMING.features.duration}
          compositionWidth={TIMING.features.width}
          compositionHeight={TIMING.features.height}
          fps={TIMING.fps}
          autoPlay
          loop
          style={{ width: "100%", height: "100%" }}
        />
      ),
    }),
  ),
);

const LazyTrackResults = lazy(() =>
  Promise.all([import("@remotion/player"), import("@/remotion/features/TrackResultsDemo")]).then(
    ([playerModule, demoModule]) => ({
      default: () => (
        <playerModule.Player
          component={demoModule.TrackResultsDemo}
          durationInFrames={TIMING.features.duration}
          compositionWidth={TIMING.features.width}
          compositionHeight={TIMING.features.height}
          fps={TIMING.fps}
          autoPlay
          loop
          style={{ width: "100%", height: "100%" }}
        />
      ),
    }),
  ),
);

interface Feature {
  icon: IconSvgElement;
  title: string;
  description: string;
  cardBg: string;
  DemoComponent: React.ComponentType;
}

const FEATURES: Feature[] = [
  {
    icon: Mail01Icon,
    title: "Send at scale",
    description:
      "Queue thousands of emails through a Kafka-powered pipeline. Rate limiting and retry logic come standard.",
    cardBg: "var(--color-sticky-note-mint)",
    DemoComponent: LazySendAtScale,
  },
  {
    icon: UserListIcon,
    title: "Manage contacts",
    description:
      "Import contacts via CSV, organize into lists, and track status as bounces and unsubscribes arrive.",
    cardBg: "var(--color-sticky-note-teal)",
    DemoComponent: LazyManageContacts,
  },
  {
    icon: ChartAnalysisIcon,
    title: "Track results",
    description:
      "Open rates, click rates, and bounce data update in real time. No waiting for next day reports.",
    cardBg: "var(--color-sticky-note-blush)",
    DemoComponent: LazyTrackResults,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="px-6 py-24 max-w-5xl mx-auto"
      aria-labelledby="features-heading"
    >
      <motion.h2
        id="features-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="text-foreground mb-16 text-center"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(2.5rem, 5vw + 1rem, 4.5rem)",
          letterSpacing: "0.04em",
          lineHeight: 1.05,
        }}
      >
        What you get
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {FEATURES.map(({ icon, title, description, cardBg, DemoComponent }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="rounded-xl p-6 space-y-4 cursor-default"
            style={{
              backgroundColor: cardBg,
              border: "1px solid var(--color-forest-ink)",
            }}
          >
            {/* Remotion micro-demo */}
            <div
              className="w-full overflow-hidden"
              style={{
                borderRadius: 8,
                border: "1px solid var(--color-forest-ink)",
                backgroundColor: cardBg,
                height: 160,
              }}
            >
              <Suspense
                fallback={
                  <div style={{ width: "100%", height: "100%", backgroundColor: cardBg }} />
                }
              >
                <DemoComponent />
              </Suspense>
            </div>

            {/* Icon + text */}
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
                style={{ backgroundColor: "rgba(26,51,0,0.10)" }}
              >
                <HugeiconsIcon
                  icon={icon}
                  size={16}
                  primaryColor="var(--color-forest-ink)"
                  strokeWidth={1.5}
                />
              </div>
              <h3
                className="font-semibold text-foreground text-lg"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {title}
              </h3>
            </div>

            <p className="text-sm text-foreground/65 leading-relaxed">{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
