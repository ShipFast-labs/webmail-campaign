import { motion } from "motion/react";
import { Suspense, lazy } from "react";
import { HOW_IT_WORKS_DURATION } from "@/remotion/HowItWorksDemo";

const STEPS = [
  { n: "01", label: "Add contacts" },
  { n: "02", label: "Create a list" },
  { n: "03", label: "Build template" },
  { n: "04", label: "Create campaign" },
  { n: "05", label: "Watch analytics" },
];

const LazyHowItWorksPlayer = lazy(() =>
  Promise.all([import("@remotion/player"), import("@/remotion/HowItWorksDemo")]).then(
    ([playerModule, demoModule]) => ({
      default: () => (
        <playerModule.Player
          component={demoModule.HowItWorksDemo}
          durationInFrames={HOW_IT_WORKS_DURATION}
          compositionWidth={1280}
          compositionHeight={720}
          fps={30}
          autoPlay
          loop
          style={{ width: "100%", aspectRatio: "16 / 9", display: "block" }}
        />
      ),
    }),
  ),
);

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative px-6 py-24 overflow-hidden"
      aria-labelledby="how-it-works-heading"
      style={{ backgroundColor: "var(--color-cream-paper)" }}
    >
      <div className="relative max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center"
        >
          <h2
            id="how-it-works-heading"
            className="text-foreground"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.5rem, 5vw + 1rem, 4.5rem)",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            See the full workflow
          </h2>
          <p className="mt-4 text-base text-muted-foreground mx-auto whitespace-nowrap">
            Import contacts, build a campaign, and watch the results roll in.
          </p>
        </motion.div>

        {/* Player */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full overflow-hidden"
          style={{
            borderRadius: "var(--mm-radius-small)",
            border: "1.5px solid var(--color-mm-ink-black)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.12), 0 8px 24px -8px rgba(0,0,0,0.08)",
          }}
        >
          <Suspense
            fallback={
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  backgroundColor: "var(--color-cream-paper)",
                }}
              />
            }
          >
            <LazyHowItWorksPlayer />
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}
