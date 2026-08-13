import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  COLORS,
  SPRING_CONFIGS,
  TIMING,
  FONTS,
  EASING,
  rangeProgress,
} from "../constants";

const BARS = [
  { label: "Sent", value: 100, maxHeight: 80, color: COLORS.forestInk },
  { label: "Open", value: 68, maxHeight: 55, color: COLORS.stickyTeal },
  { label: "Click", value: 24, maxHeight: 22, color: COLORS.skyPop },
  { label: "Bounce", value: 2, maxHeight: 4, color: COLORS.terracotta },
];

export function TrackResultsDemo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "10px 24px 16px",
        overflow: "hidden",
      }}
    >
      {/* Bars container */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 16,
          height: 110,
          width: "100%",
          justifyContent: "center",
        }}
      >
        {BARS.map((bar, i) => {
          const delay = 10 + i * TIMING.stagger.chartBars;
          const barProgress = spring({
            frame: frame - delay,
            fps,
            config: SPRING_CONFIGS.gentle,
          });

          const height = bar.maxHeight * barProgress;

          // Number count
          const numProgress = rangeProgress(
            frame,
            delay + 5,
            delay + 5 + 30,
          );
          const easedNum = EASING.easeOutCubic(numProgress);
          const displayVal = Math.floor(bar.value * easedNum);

          return (
            <div
              key={bar.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              {/* Number label */}
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  fontWeight: 600,
                  color: bar.color,
                  opacity: interpolate(
                    frame,
                    [delay + 8, delay + 18],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  ),
                }}
              >
                {displayVal}%
              </div>

              {/* Bar */}
              <div
                style={{
                  width: 32,
                  height,
                  backgroundColor: bar.color,
                  borderRadius: "4px 4px 2px 2px",
                  opacity: interpolate(barProgress, [0, 0.3], [0, 1]),
                }}
              />

              {/* Label */}
              <div
                style={{
                  fontSize: 8,
                  fontWeight: 500,
                  color: COLORS.stoneGray,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  opacity: interpolate(
                    frame,
                    [delay + 12, delay + 22],
                    [0, 0.7],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  ),
                }}
              >
                {bar.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
