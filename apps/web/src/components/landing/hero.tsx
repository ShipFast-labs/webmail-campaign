import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Player } from "@remotion/player";
import { Button } from "@/components/ui/button";
import { HeroDemo } from "@/remotion/HeroDemo";
import { TIMING } from "@/remotion/constants";

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
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
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
                letterSpacing: "var(--mm-tracking-display)",
                lineHeight: "0.95",
                color: "var(--color-mm-ink-black)",
              }}
            >
              Email campaigns that{" "}
              <span style={{ color: "var(--color-mm-fresh-grass)" }}>
                Deliver
              </span>
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
                opacity: 0.8
              }}
            >
              Build, send, and track campaigns to your contact lists. Real-time analytics show you
              what worked.
            </motion.p>

            {/* CTA group */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-6 flex-wrap"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
                <Button
                  asChild
                  className="rounded-full h-14 px-8 font-medium flex items-center gap-3 group relative overflow-hidden transition-transform"
                  style={{
                    backgroundColor: "var(--color-mm-pure-white)",
                    color: "var(--color-mm-ink-black)",
                    border: "1.5px solid var(--color-mm-ink-black)",
                    fontSize: "17px"
                  }}
                >
                  <Link to="/register">
                    Get started
                  </Link>
                </Button>
              </motion.div>

              <motion.a
                href="#how-it-works"
                className="font-medium hover:opacity-70 transition-opacity"
                style={{
                  color: "var(--color-mm-stone-gray)",
                  fontSize: "16px",
                  borderBottom: "1px solid var(--color-mm-stone-gray)",
                  paddingBottom: "2px"
                }}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                How it works
              </motion.a>
            </motion.div>
          </div>

          {/* Right Column: Product Demo Video */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full relative lg:col-span-7"
          >
            {/* Decorative background blob for the video */}
            <div 
              className="absolute -inset-4 bg-[var(--color-mm-fresh-grass)] opacity-20 blur-3xl rounded-full z-0" 
              aria-hidden 
            />

            <div
              className="absolute z-0 hidden lg:block"
              aria-hidden
              style={{
                bottom: "-40px",
                left: "-60px",
                transform: "rotate(24deg) scaleY(-1)",
                transformOrigin: "center"
              }}
            >
              <svg width="140" height="180" viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Green pill */}
                <rect x="0" y="50" width="32" height="100" rx="16" fill="var(--color-mm-fresh-grass)" stroke="var(--color-mm-ink-black)" strokeWidth="2" />
                {/* Coral pill */}
                <rect x="46" y="10" width="32" height="140" rx="16" fill="var(--color-mm-coral-pop)" stroke="var(--color-mm-ink-black)" strokeWidth="2" />
                {/* Yellow pill */}
                <rect x="92" y="70" width="32" height="80" rx="16" fill="var(--color-mm-sunshine-pop)" stroke="var(--color-mm-ink-black)" strokeWidth="2" />
              </svg>
            </div>
            
            <div
              className="w-full overflow-hidden relative z-10"
              style={{
                borderRadius: "var(--mm-radius-small)",
                border: "1.5px solid var(--color-mm-ink-black)",
                boxShadow:
                  "0 25px 50px -12px rgba(0,0,0,0.15), 0 8px 24px -8px rgba(0,0,0,0.1)",
              }}
            >
              <Player
                component={HeroDemo}
                durationInFrames={TIMING.heroDuration}
                compositionWidth={1280}
                compositionHeight={720}
                fps={TIMING.fps}
                autoPlay
                loop
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  display: "block"
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
