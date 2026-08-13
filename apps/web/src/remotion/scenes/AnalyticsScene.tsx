import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  COLORS,
  FONTS,
  SPRING_CONFIGS,
  TIMING,
  EASING,
  rangeProgress,
} from "../constants";
import { AppFrame } from "./AppFrame";

const ANALYTICS_KPIS = [
  { label: "Delivered", value: 12847, suffix: "", color: COLORS.forestInk },
  { label: "Opened", value: 8791, suffix: "", color: COLORS.stickyTeal },
  { label: "Clicked", value: 3094, suffix: "", color: COLORS.skyPop },
  { label: "Bounced", value: 103, suffix: "", color: COLORS.terracotta },
];

// Area chart data points (hourly opens over 24h)
const OPENS_DATA = [
  5, 8, 12, 35, 62, 78, 95, 88, 72, 55, 48, 42, 38, 45, 52, 48, 40, 35, 30,
  25, 18, 12, 8, 5,
];
const SENDS_DATA = [
  80, 85, 90, 92, 94, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95,
  95, 95, 95, 95, 95,
];

export function AnalyticsScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AppFrame activeItem="Analytics">
      {/* Page heading */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.inkBlack,
            opacity: interpolate(frame, [0.4 * fps, 0.7 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Campaign Analytics
        </div>
        <div
          style={{
            fontSize: 12,
            color: COLORS.stoneGray,
            marginTop: 3,
            opacity: interpolate(frame, [0.5 * fps, 0.8 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Summer Sale Launch — Aug 5, 2026
        </div>
      </div>

      {/* KPI Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {ANALYTICS_KPIS.map((kpi, i) => {
          const delay = 0.6 * fps + i * TIMING.stagger.kpiCards;
          const cardProgress = spring({
            frame: frame - delay,
            fps,
            config: SPRING_CONFIGS.smooth,
          });

          const numProgress = rangeProgress(
            frame,
            delay + 8,
            delay + 8 + TIMING.durations.numberCount,
          );
          const easedNum = EASING.easeOutCubic(numProgress);
          const displayValue = Math.floor(kpi.value * easedNum).toLocaleString();

          return (
            <div
              key={kpi.label}
              style={{
                backgroundColor: COLORS.offWhite,
                border: `1px solid ${COLORS.hairlineMist}`,
                borderRadius: 10,
                padding: "12px 14px",
                opacity: cardProgress,
                transform: `translateY(${interpolate(
                  cardProgress,
                  [0, 1],
                  [14, 0],
                )}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontFamily: FONTS.mono,
                  color: COLORS.stoneGray,
                  fontWeight: 500,
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {kpi.label}
              </div>
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 22,
                  fontWeight: 800,
                  color: kpi.color,
                  lineHeight: 1.1,
                }}
              >
                {displayValue}
                {kpi.suffix}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Card */}
      <div
        style={{
          backgroundColor: COLORS.offWhite,
          border: `1px solid ${COLORS.hairlineMist}`,
          borderRadius: 12,
          padding: 14,
          opacity: interpolate(frame, [1.5 * fps, 1.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(
            frame,
            [1.5 * fps, 1.9 * fps],
            [10, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.inkBlack,
              }}
            >
              Opens over time
            </div>
            <div style={{ fontSize: 10, color: COLORS.stoneGray, marginTop: 2 }}>
              Hourly breakdown — first 24 hours
            </div>
          </div>

          {/* Delivery rate highlight */}
          <DeliveryBadge frame={frame} fps={fps} />
        </div>

        {/* Chart SVG */}
        <svg
          viewBox="0 0 400 100"
          style={{ width: "100%", height: 85, display: "block" }}
        >
          {/* Grid */}
          {[25, 50, 75].map((y) => (
            <line
              key={y}
              x1={0}
              y1={y}
              x2={400}
              y2={y}
              stroke={COLORS.pencilGray}
              strokeWidth={0.5}
              strokeDasharray="3 3"
              opacity={0.3}
            />
          ))}

          {/* Sends area (background) */}
          <AnimatedArea
            data={SENDS_DATA}
            frame={frame}
            fps={fps}
            color={COLORS.forestInk}
            fillOpacity={0.06}
            strokeWidth={1.5}
            startDelay={1.6}
          />

          {/* Opens area (foreground) */}
          <AnimatedArea
            data={OPENS_DATA}
            frame={frame}
            fps={fps}
            color={COLORS.stickyTeal}
            fillOpacity={0.25}
            strokeWidth={2}
            startDelay={1.8}
          />
        </svg>
      </div>
    </AppFrame>
  );
}

/** Delivery rate badge with green pulse */
function DeliveryBadge({ frame, fps }: { frame: number; fps: number }) {
  const appear = interpolate(frame, [2.0 * fps, 2.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const numProgress = rangeProgress(frame, 2.2 * fps, 2.2 * fps + 30);
  const easedVal = EASING.easeOutCubic(numProgress);
  const pct = (99.2 * easedVal).toFixed(1);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 20,
        backgroundColor: "rgba(34,197,94,0.1)",
        opacity: appear,
        transform: `scale(${interpolate(appear, [0, 1], [0.85, 1])})`,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "#22c55e",
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#22c55e",
        }}
      >
        {pct}% delivered
      </span>
    </div>
  );
}

/** Animated SVG area + line */
function AnimatedArea({
  data,
  frame,
  fps,
  color,
  fillOpacity,
  strokeWidth,
  startDelay,
}: {
  data: number[];
  frame: number;
  fps: number;
  color: string;
  fillOpacity: number;
  strokeWidth: number;
  startDelay: number;
}) {
  const drawProgress = interpolate(
    frame,
    [startDelay * fps, (startDelay + 1.2) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const visibleCount = Math.max(2, Math.ceil(drawProgress * data.length));
  const visible = data.slice(0, visibleCount);
  const maxVal = Math.max(...data);

  const toPoint = (val: number, i: number) => {
    const x = (i / (data.length - 1)) * 400;
    const y = 95 - (val / maxVal) * 85;
    return `${x},${y}`;
  };

  const linePoints = visible.map(toPoint).join(" ");
  const lastX = ((visibleCount - 1) / (data.length - 1)) * 400;
  const areaD = `M0,95 L${linePoints} L${lastX},95 Z`;

  return (
    <>
      <path d={areaD} fill={color} opacity={fillOpacity} />
      <polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}
