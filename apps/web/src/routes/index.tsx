import { createFileRoute } from "@tanstack/react-router"
import { ReactLenis } from "lenis/react"

import { Footer } from "@/components/footer"
import { Nav } from "@/components/nav"
import { CtaStrip } from "@/components/landing/cta-strip"
import { Faq } from "@/components/landing/faq"
import { Features } from "@/components/landing/features"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Stats } from "@/components/landing/stats"

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
          backgroundColor: "var(--color-mm-cream-paper)",
        }}
      />
      <Nav />
      <main>
        <Hero />
        <Features />
        <Stats />
        <HowItWorks />
        <Faq />
        <CtaStrip />
      </main>
      <Footer />
    </ReactLenis>
  )
}
