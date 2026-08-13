import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SPRING_CONFIGS, FONTS } from "../constants";

export function Step2Build() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance
  const appear = spring({
    frame: frame - 5,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  // Typing effect
  const typeText = "Hi {{first_name}},";
  const typeLength = Math.floor(
    interpolate(frame, [15, 45], [0, typeText.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 24px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 100,
          backgroundColor: COLORS.offWhite,
          border: `1.5px solid ${COLORS.forestInk}`,
          borderRadius: 8,
          opacity: appear,
          transform: `translateY(${interpolate(appear, [0, 1], [15, 0])}px)`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Editor Toolbar */}
        <div
          style={{
            height: 24,
            borderBottom: `1px solid ${COLORS.forestInk}33`,
            display: "flex",
            alignItems: "center",
            padding: "0 8px",
            gap: 4,
          }}
        >
          <div style={{ width: 12, height: 4, backgroundColor: `${COLORS.forestInk}40`, borderRadius: 2 }} />
          <div style={{ width: 16, height: 4, backgroundColor: `${COLORS.forestInk}40`, borderRadius: 2 }} />
          <div style={{ width: 12, height: 4, backgroundColor: `${COLORS.forestInk}40`, borderRadius: 2 }} />
        </div>
        
        {/* Editor Body */}
        <div
          style={{
            flex: 1,
            padding: 12,
            fontFamily: FONTS.mono,
            fontSize: 12,
            color: COLORS.forestInk,
            fontWeight: 500,
          }}
        >
          {typeText.substring(0, typeLength)}
          <span
            style={{
              opacity: Math.floor(frame / 10) % 2 === 0 ? 1 : 0,
            }}
          >
            |
          </span>
          {/* Skeleton lines for rest of email */}
          <div
            style={{
              width: "80%",
              height: 4,
              backgroundColor: `${COLORS.forestInk}20`,
              borderRadius: 2,
              marginTop: 12,
            }}
          />
          <div
            style={{
              width: "60%",
              height: 4,
              backgroundColor: `${COLORS.forestInk}20`,
              borderRadius: 2,
              marginTop: 6,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
}
