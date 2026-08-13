/**
 * SendAtScaleDemo — Micro-animation for the "Send at scale" feature card.
 * Envelope icons spring in with bouncy config, flying into a queue.
 */
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, SPRING_CONFIGS, TIMING, FONTS } from "../constants";

const ENVELOPE_COUNT = 5;

export function SendAtScaleDemo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Queue line */}
      <div
        style={{
          position: "absolute",
          bottom: 55,
          left: 40,
          right: 40,
          height: 2,
          backgroundColor: COLORS.forestInk,
          opacity: interpolate(frame, [5, 15], [0, 0.15], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          borderRadius: 1,
        }}
      />

      {/* Envelopes */}
      {Array.from({ length: ENVELOPE_COUNT }).map((_, i) => {
        const delay = 8 + i * TIMING.stagger.items;
        const progress = spring({
          frame: frame - delay,
          fps,
          config: SPRING_CONFIGS.bouncy,
        });

        const x = interpolate(progress, [0, 1], [-60, 30 + i * 50]);
        const y = interpolate(progress, [0, 1], [-30, 0]);
        const rotate = interpolate(progress, [0, 1], [-15 + i * 5, 0]);
        const opacity = interpolate(
          frame,
          [delay, delay + 5],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 60,
              left: x,
              transform: `translateY(${y}px) rotate(${rotate}deg)`,
              opacity,
            }}
          >
            {/* Envelope shape */}
            <div
              style={{
                width: 36,
                height: 26,
                borderRadius: 4,
                backgroundColor: i === ENVELOPE_COUNT - 1 ? COLORS.freshGrass : COLORS.offWhite,
                border: `1.5px solid ${COLORS.forestInk}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Flap */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  borderBottom: `1px solid ${COLORS.forestInk}`,
                  background: `linear-gradient(135deg, transparent 45%, ${COLORS.forestInk}22 45%, ${COLORS.forestInk}22 55%, transparent 55%)`,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Counter text */}
      <div
        style={{
          position: "absolute",
          bottom: 18,
          fontFamily: FONTS.mono,
          fontSize: 11,
          fontWeight: 500,
          color: COLORS.forestInk,
          opacity: interpolate(frame, [40, 55], [0, 0.7], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {Math.min(
          ENVELOPE_COUNT,
          Math.floor(
            interpolate(frame, [40, 70], [0, ENVELOPE_COUNT], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          ),
        )}{" "}
        / {ENVELOPE_COUNT} queued
      </div>
    </AbsoluteFill>
  );
}
