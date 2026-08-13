/**
 * ManageContactsDemo — Micro-animation for the "Manage contacts" feature card.
 * CSV rows transform into contact cards with smooth entrance animation.
 */
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SPRING_CONFIGS, TIMING, FONTS } from "../constants";

const CONTACTS = [
  { name: "Sarah Chen", email: "sarah@acme.co" },
  { name: "Marcus R.", email: "marcus@demo.io" },
  { name: "Priya Patel", email: "priya@xyz.com" },
];

export function ManageContactsDemo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 20px",
        gap: 6,
        overflow: "hidden",
      }}
    >
      {CONTACTS.map((contact, i) => {
        const delay = 10 + i * TIMING.stagger.items;
        const progress = spring({
          frame: frame - delay,
          fps,
          config: SPRING_CONFIGS.smooth,
        });

        const scale = interpolate(progress, [0, 1], [0.8, 1]);
        const translateX = interpolate(progress, [0, 1], [-30, 0]);

        return (
          <div
            key={contact.name}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 8,
              backgroundColor: COLORS.offWhite,
              border: `1px solid ${COLORS.hairlineMist}`,
              opacity: progress,
              transform: `translateX(${translateX}px) scale(${scale})`,
            }}
          >
            {/* Avatar circle */}
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor:
                  [COLORS.stickyMint, COLORS.stickyTeal, COLORS.stickyBlush][i],
                border: `1px solid ${COLORS.forestInk}`,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                color: COLORS.forestInk,
              }}
            >
              {contact.name[0]}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: COLORS.inkBlack,
                  lineHeight: 1.2,
                }}
              >
                {contact.name}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: COLORS.stoneGray,
                  lineHeight: 1.2,
                }}
              >
                {contact.email}
              </div>
            </div>
            {/* Status dot */}
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                flexShrink: 0,
                opacity: interpolate(
                  frame,
                  [delay + 15, delay + 25],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                ),
              }}
            />
          </div>
        );
      })}

      {/* Import hint */}
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 9,
          color: COLORS.stoneGray,
          marginTop: 2,
          opacity: interpolate(frame, [45, 60], [0, 0.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        3 contacts imported ✓
      </div>
    </AbsoluteFill>
  );
}
