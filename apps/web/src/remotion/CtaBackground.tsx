/**
 * CtaBackground — Looping ambient animation for the CTA strip background.
 * Floating geometric shapes drift slowly using sinusoidal motion.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, TIMING } from "./constants";

interface FloatingShape {
  x: number; // Base X position (%)
  y: number; // Base Y position (%)
  size: number;
  color: string;
  opacity: number;
  speed: number; // Speed multiplier
  phase: number; // Phase offset (radians)
  type: "circle" | "pill";
}

const SHAPES: FloatingShape[] = [
  {
    x: 15,
    y: 20,
    size: 60,
    color: COLORS.highlighterYellow,
    opacity: 0.08,
    speed: 0.8,
    phase: 0,
    type: "circle",
  },
  {
    x: 75,
    y: 70,
    size: 80,
    color: COLORS.stickyMint,
    opacity: 0.06,
    speed: 1.2,
    phase: Math.PI * 0.5,
    type: "pill",
  },
  {
    x: 50,
    y: 30,
    size: 45,
    color: COLORS.stickyTeal,
    opacity: 0.07,
    speed: 1.0,
    phase: Math.PI,
    type: "circle",
  },
  {
    x: 85,
    y: 25,
    size: 55,
    color: COLORS.highlighterYellow,
    opacity: 0.05,
    speed: 0.6,
    phase: Math.PI * 1.5,
    type: "pill",
  },
  {
    x: 30,
    y: 75,
    size: 40,
    color: COLORS.stickyBlush,
    opacity: 0.06,
    speed: 1.4,
    phase: Math.PI * 0.3,
    type: "circle",
  },
];

export function CtaBackground() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const loopDuration = TIMING.ctaLoop.duration;
  const loopProgress = (frame % loopDuration) / loopDuration;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.forestInk,
        overflow: "hidden",
      }}
    >
      {/* Base dot texture (matching original) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,233,92,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Floating shapes */}
      {SHAPES.map((shape, i) => {
        const t = loopProgress * Math.PI * 2 + shape.phase;
        const floatX = Math.sin(t * shape.speed) * 15;
        const floatY = Math.cos(t * shape.speed * 0.7) * 12;
        const rotate = loopProgress * 360 * (i % 2 === 0 ? 0.3 : -0.2);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: shape.size,
              height: shape.type === "pill" ? shape.size * 2 : shape.size,
              borderRadius: shape.type === "pill" ? shape.size : "50%",
              backgroundColor: shape.color,
              opacity: shape.opacity,
              transform: `translate(${floatX}px, ${floatY}px) rotate(${rotate}deg)`,
              filter: "blur(1px)",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}
