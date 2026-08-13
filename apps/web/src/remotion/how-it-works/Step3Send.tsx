/**
 * Step3Send — How it works Step 3 (Send & Watch)
 * Shows a "Send Now" button press, followed by an analytics graph ticking up.
 */
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SPRING_CONFIGS, FONTS } from "../constants";

export function Step3Send() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Button entrance
  const btnAppear = spring({
    frame: frame - 5,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // Button click scale
  const btnScale = interpolate(
    spring({ frame: frame - 25, fps, config: { damping: 10, stiffness: 200, mass: 0.5 } }),
    [0, 0.5, 1],
    [1, 0.9, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const hideBtn = interpolate(frame, [35, 45], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Chart data
  const chartPoints = [10, 25, 45, 80, 95];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      {/* Send Button State */}
      <div
        style={{
          opacity: hideBtn,
          transform: `scale(${interpolate(btnAppear, [0, 1], [0.8, 1]) * btnScale}) translateY(${interpolate(btnAppear, [0, 1], [15, 0])}px)`,
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.inkBlack,
            color: COLORS.creamPaper,
            padding: "8px 16px",
            borderRadius: 6,
            fontFamily: FONTS.sans,
            fontWeight: 600,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ▶ Send Now
        </div>
      </div>

      {/* Analytics State */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - hideBtn,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "16px 24px",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 60 }}>
          {chartPoints.map((val, i) => {
            const barGrow = spring({
              frame: frame - (45 + i * 5),
              fps,
              config: SPRING_CONFIGS.gentle,
            });

            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div
                  style={{
                    width: 14,
                    height: val * barGrow * 0.5, // max height ~50px
                    backgroundColor: COLORS.forestInk,
                    borderRadius: "4px 4px 0 0",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}
