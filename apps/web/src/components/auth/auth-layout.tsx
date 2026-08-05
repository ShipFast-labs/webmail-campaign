import { motion } from "motion/react";

import { Card } from "@/components/ui/card";
import { CardGlowEdge } from "./card-glow-edge";

type Props = { children: React.ReactNode };

export function AuthLayout({ children }: Props) {
  return (
    <div className="relative min-h-svh flex items-center justify-center px-4 py-12 overflow-hidden bg-background">
      {/* Cross grid pattern — fades toward center */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, var(--pattern-line) 49%, var(--pattern-line) 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, var(--pattern-line) 49%, var(--pattern-line) 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, #000 80%)",
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, #000 80%)",
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card
          className="border-border/60 shadow-2xl overflow-hidden pb-0"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            backgroundColor: "oklch(from var(--background) l c h / 0.88)",
          }}
        >
          {children}
          <CardGlowEdge />
        </Card>
      </motion.div>
    </div>
  );
}
