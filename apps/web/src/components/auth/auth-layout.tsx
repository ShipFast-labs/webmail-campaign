import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { CardGlowEdge } from "./card-glow-edge";

type Props = { children: React.ReactNode };

export function AuthLayout({ children }: Props) {
  return (
    <div className="relative min-h-svh flex items-center justify-center px-4 py-12 overflow-hidden bg-background">
      {/* Top Fade Grid Background */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
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

      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="overflow-hidden pb-0 border-2">
          {children}
          <CardGlowEdge />
        </Card>
      </motion.div>
    </div>
  );
}
