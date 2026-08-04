import { createFileRoute } from "@tanstack/react-router"

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
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Faq />
        <CtaStrip />
      </main>
      <Footer />
    </>
  )
}
