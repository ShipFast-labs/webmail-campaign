import { motion } from "motion/react";

interface DashedBorderProps {
  position: "top" | "bottom" | "left" | "right";
  offset?: string;
  extend?: string;
  delay?: number;
  duration?: number;
  continuous?: boolean;
  className?: string;
}

export function DashedBorder({
  position,
  offset = "0%",
  extend = "0px",
  delay = 0,
  duration = 0.8,
  continuous = false,
  className = "",
}: DashedBorderProps) {
  const isVertical = position === "left" || position === "right";

  const containerStyle: React.CSSProperties = isVertical
    ? {
        position: "absolute",
        [position]: offset,
        top: `calc(0px - ${extend})`,
        height: `calc(100% + ${extend} + ${extend})`,
        width: "4px",
        pointerEvents: "none",
      }
    : {
        position: "absolute",
        [position]: offset,
        left: `calc(0px - ${extend})`,
        width: `calc(100% + ${extend} + ${extend})`,
        height: "4px",
        pointerEvents: "none",
      };

  const dashArray = "8 6";
  const dashTotal = 14; // must match sum of dashArray values for seamless loop

  return (
    <div style={containerStyle} aria-hidden="true" className={className}>
      <svg
        width="100%"
        height="100%"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.line
          x1={isVertical ? "50%" : "0%"}
          y1={isVertical ? "0%" : "50%"}
          x2={isVertical ? "50%" : "100%"}
          y2={isVertical ? "100%" : "50%"}
          fill="none"
          style={{ stroke: "var(--primary)" }}
          strokeWidth="2"
          strokeDasharray={dashArray}
          initial={{ opacity: 0, strokeDashoffset: 0 }}
          animate={
            continuous
              ? { opacity: 0.75, strokeDashoffset: -dashTotal }
              : { opacity: 0.75, strokeDashoffset: 0 }
          }
          transition={
            continuous
              ? {
                  opacity: { duration: 0.3, delay },
                  strokeDashoffset: {
                    duration: 0.9,
                    delay,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }
              : { duration, delay, ease: "easeOut" }
          }
        />
      </svg>
    </div>
  );
}

interface DashedBordersProps {
  borders: Array<{
    position: "top" | "bottom" | "left" | "right";
    offset?: string;
  }>;
  continuous?: boolean;
  className?: string;
}

export function DashedBorders({ borders, continuous, className }: DashedBordersProps) {
  return (
    <>
      {borders.map((border, index) => (
        <DashedBorder
          key={`${border.position}-${border.offset}-${index}`}
          position={border.position}
          offset={border.offset}
          continuous={continuous}
          className={className}
        />
      ))}
    </>
  );
}
