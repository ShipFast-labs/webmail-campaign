import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { TIMING } from "@/remotion/constants";

const LazyHeroPlayer = lazy(() =>
  Promise.all([import("@remotion/player"), import("@/remotion/HeroDemo")]).then(
    ([playerModule, demoModule]) => ({
      default: () => (
        <playerModule.Player
          component={demoModule.HeroDemo}
          durationInFrames={TIMING.heroDuration}
          compositionWidth={1280}
          compositionHeight={720}
          fps={TIMING.fps}
          autoPlay
          loop
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            display: "block",
          }}
        />
      ),
    }),
  ),
);

export function Hero() {
  return (
    <section
      className="relative min-h-[90vh] w-full px-4 sm:px-6 pt-32 pb-20 overflow-hidden flex flex-col justify-center"
      aria-labelledby="hero-heading"
      style={{ backgroundColor: "var(--color-mm-cream-paper)" }}
    >
      {/* Top Fade Grid Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />
      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-4 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text */}
          <div className="lg:col-span-5 max-w-full mx-auto lg:mx-0">
            {/* Display headline */}
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(48px, 6vw, 96px)",
                letterSpacing: "-0.01em",
                lineHeight: "0.95",
                color: "var(--color-mm-ink-black)",
              }}
            >
              Email campaigns that{" "}
              <span style={{ color: "var(--color-mm-fresh-grass)" }}>Deliver</span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 mb-8 text-lg leading-relaxed max-w-[42ch]"
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--color-mm-ink-black)",
                opacity: 0.8,
              }}
            >
              Import your contacts, pick a template, and hit send. See exactly who opened, clicked,
              or bounced in real time.
            </motion.p>

            {/* CTA group */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 flex-wrap"
            >
              <Button
                asChild
                className="rounded-full h-10 px-6 font-medium text-sm"
                style={{
                  backgroundColor: "var(--color-mm-fresh-grass)",
                  color: "#000000",
                }}
              >
                <Link to="/register">Send now</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="rounded-full h-10 px-6 font-medium text-sm"
                style={{
                  backgroundColor: "transparent",
                  color: "#000000",
                  border: "1.5px solid var(--color-mm-fresh-grass)",
                }}
              >
                <a href="#how-it-works">Watch demo</a>
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Product Demo Video */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full relative lg:col-span-7"
          >
            <div
              className="w-full overflow-hidden relative z-10"
              style={{
                borderRadius: "var(--mm-radius-small)",
                border: "1.5px solid var(--color-mm-ink-black)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15), 0 8px 24px -8px rgba(0,0,0,0.1)",
              }}
            >
              <Suspense
                fallback={
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "16 / 9",
                      backgroundColor: "var(--color-mm-cream-paper)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                }
              >
                <LazyHeroPlayer />
              </Suspense>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
