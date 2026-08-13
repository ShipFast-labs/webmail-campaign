/**
 * Step1Import — How it works Step 1 (Import Contacts)
 * Shows a CSV icon uploading, followed by mapping columns.
 */
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SPRING_CONFIGS, FONTS } from "../constants";

export function Step1Import() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CSV Icon bounces in
  const uploadProgress = spring({
    frame: frame - 5,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const hideUpload = interpolate(frame, [35, 45], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      {/* Upload State */}
      <div
        style={{
          opacity: hideUpload,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${interpolate(uploadProgress, [0, 1], [0.5, 1])}) translateY(${interpolate(uploadProgress, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            width: 48,
            height: 60,
            backgroundColor: COLORS.offWhite,
            border: `2px solid ${COLORS.forestInk}`,
            borderRadius: 6,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: FONTS.display, fontSize: 14, fontWeight: 800, color: COLORS.forestInk }}>
            CSV
          </span>
          {/* Folded corner */}
          <div
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              borderBottom: `16px solid ${COLORS.forestInk}`,
              borderRight: "16px solid transparent",
              transform: "rotate(90deg)",
            }}
          />
        </div>
        {/* Upload progress bar */}
        <div style={{ width: 64, height: 4, backgroundColor: `${COLORS.forestInk}33`, borderRadius: 2, marginTop: 12, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              backgroundColor: COLORS.forestInk,
              width: `${interpolate(frame, [15, 35], [0, 100], { extrapolateRight: "clamp" })}%`,
            }}
          />
        </div>
      </div>

      {/* Mapping State */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - hideUpload,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 24px",
          gap: 8,
        }}
      >
        {["Email Address", "First Name"].map((field, i) => {
          const appear = spring({
            frame: frame - (45 + i * 5),
            fps,
            config: SPRING_CONFIGS.smooth,
          });

          return (
            <div
              key={field}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: COLORS.offWhite,
                border: `1px solid ${COLORS.forestInk}`,
                borderRadius: 6,
                padding: "6px 10px",
                opacity: appear,
                transform: `translateX(${interpolate(appear, [0, 1], [-10, 0])}px)`,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.stoneGray }}>{field}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.forestInk }}>Match ✓</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
