import { createFileRoute } from "@tanstack/react-router"
import { ReactLenis } from "lenis/react"

import { Footer } from "@/components/footer"
import { Nav } from "@/components/nav"
import { CtaStrip } from "@/components/landing/cta-strip"
import { Faq } from "@/components/landing/faq"
import { Features } from "@/components/landing/features"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"

export const Route = createFileRoute("/")({
  component: LandingPage,
})

function LandingPage() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.4 }}>
      {/* Fixed geometric grid — viewport-locked, never scrolls */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--pattern-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--pattern-line) 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Faq />
        <CtaStrip />
      </main>
      <Footer />
    </ReactLenis>
  )
}
