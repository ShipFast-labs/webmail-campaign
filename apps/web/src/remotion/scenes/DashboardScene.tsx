/**
 * DashboardScene — Animated recreation of the dashboard KPI cards.
 * 4 KPI cards spring in with staggered delay, numbers count up.
 */
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cursor01Icon, MailBlock01Icon, MailOpen01Icon, MailSend01Icon } from "@hugeicons/core-free-icons";
import {
  COLORS,
  FONTS,
  SPRING_CONFIGS,
  TIMING,
  EASING,
  rangeProgress,
} from "../constants";
import { AppFrame } from "./AppFrame";

const KPI_DATA = [
  {
    label: "Total Sent",
    value: 12847,
    suffix: "",
    trend: "+12%",
    trendGood: true,
    bg: COLORS.stickyMint,
    icon: MailSend01Icon,
  },
  {
    label: "Open Rate",
    value: 68.4,
    suffix: "%",
    trend: "+5.2%",
    trendGood: true,
    bg: COLORS.stickyTeal,
    icon: MailOpen01Icon,
  },
  {
    label: "Click Rate",
    value: 24.1,
    suffix: "%",
    trend: "+3.8%",
    trendGood: true,
    bg: COLORS.stickyBlush,
    icon: Cursor01Icon,
  },
  {
    label: "Bounce Rate",
    value: 0.8,
    suffix: "%",
    trend: "-0.3%",
    trendGood: true,
    bg: COLORS.highlighterYellow,
    icon: MailBlock01Icon,
  },
];

// Simple mini chart data for the performance chart
const CHART_POINTS = [20, 35, 28, 45, 55, 42, 65, 58, 72, 68, 80, 75];

export function DashboardScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AppFrame activeItem="Dashboard">
      {/* Page heading */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.inkBlack,
            opacity: interpolate(frame, [0.5 * fps, 0.9 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(
              frame,
              [0.5 * fps, 0.9 * fps],
              [10, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )}px)`,
          }}
        >
          Dashboard
        </div>
        <div
          style={{
            fontSize: 12,
            color: COLORS.stoneGray,
            marginTop: 4,
            opacity: interpolate(frame, [0.6 * fps, 1.0 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Acme Corp — last 30 days
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {KPI_DATA.map((kpi, i) => {
          const delay = 0.7 * fps + i * TIMING.stagger.kpiCards;
          const cardProgress = spring({
            frame: frame - delay,
            fps,
            config: SPRING_CONFIGS.smooth,
          });

          const numberProgress = rangeProgress(
            frame,
            delay + 10,
            delay + 10 + TIMING.durations.numberCount,
          );
          const easedNumber = EASING.easeOutCubic(numberProgress);

          const displayValue =
            kpi.suffix === "%"
              ? (kpi.value * easedNumber).toFixed(1)
              : Math.floor(kpi.value * easedNumber).toLocaleString();

          const trendOpacity = interpolate(
            frame,
            [delay + 25, delay + 40],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          return (
            <div
              key={kpi.label}
              style={{
                backgroundColor: kpi.bg,
                border: `1px solid ${COLORS.forestInk}`,
                borderRadius: 12,
                padding: "14px 16px",
                opacity: cardProgress,
                transform: `translateY(${interpolate(
                  cardProgress,
                  [0, 1],
                  [20, 0],
                )}px) scale(${interpolate(cardProgress, [0, 1], [0.92, 1])})`,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: `${COLORS.forestInk}99`,
                      fontFamily: FONTS.mono,
                      marginBottom: 4,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {kpi.label}
                  </p>
                  <p
                    style={{
                      fontFamily: FONTS.display,
                      fontSize: 30,
                      fontWeight: 800,
                      color: COLORS.forestInk,
                      letterSpacing: "0.02em",
                      lineHeight: 1.1,
                      margin: 0,
                    }}
                  >
                    {displayValue}
                    {kpi.suffix}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      marginTop: 8,
                      margin: "8px 0 0 0",
                      color: kpi.trendGood ? COLORS.forestInk : COLORS.terracotta,
                      opacity: trendOpacity,
                    }}
                  >
                    {kpi.trendGood ? "↑" : "↓"} {kpi.trend} from last month
                  </p>
                </div>
                <div
                  style={{
                    flexShrink: 0,
                    borderRadius: 8,
                    padding: 10,
                    backgroundColor: "rgba(26,51,0,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HugeiconsIcon icon={kpi.icon} size={20} color={COLORS.forestInk} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Chart Card */}
      <div
        style={{
          backgroundColor: COLORS.offWhite,
          border: `1px solid ${COLORS.hairlineMist}`,
          borderRadius: 12,
          padding: 16,
          opacity: interpolate(frame, [1.8 * fps, 2.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(
            frame,
            [1.8 * fps, 2.2 * fps],
            [12, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )}px)`,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: COLORS.inkBlack,
            marginBottom: 4,
          }}
        >
          Performance Overview
        </div>
        <div
          style={{
            fontSize: 10,
            color: COLORS.stoneGray,
            marginBottom: 12,
          }}
        >
          Sends and opens — last 30 days
        </div>

        {/* SVG mini chart */}
        <svg
          viewBox="0 0 400 100"
          style={{ width: "100%", height: 90, display: "block" }}
        >
          {/* Grid lines */}
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
              opacity={0.4}
            />
          ))}

          {/* Area fill */}
          <ChartArea
            points={CHART_POINTS}
            frame={frame}
            fps={fps}
            color={COLORS.stickyTeal}
            fillOpacity={0.3}
            startDelay={2.0}
          />

          {/* Line */}
          <ChartLine
            points={CHART_POINTS}
            frame={frame}
            fps={fps}
            color={COLORS.forestInk}
            startDelay={2.0}
          />
        </svg>
      </div>
    </AppFrame>
  );
}

/** Animated SVG polyline that draws itself */
function ChartLine({
  points,
  frame,
  fps,
  color,
  startDelay,
}: {
  points: number[];
  frame: number;
  fps: number;
  color: string;
  startDelay: number;
}) {
  const drawProgress = interpolate(
    frame,
    [startDelay * fps, (startDelay + 1.5) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const visibleCount = Math.ceil(drawProgress * points.length);

  const pathPoints = points
    .slice(0, visibleCount)
    .map((val, i) => {
      const x = (i / (points.length - 1)) * 400;
      const y = 95 - (val / 100) * 90;
      return `${x},${y}`;
    })
    .join(" ");

  if (visibleCount < 2) return null;

  return (
    <polyline
      points={pathPoints}
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** Animated SVG area fill */
function ChartArea({
  points,
  frame,
  fps,
  color,
  fillOpacity,
  startDelay,
}: {
  points: number[];
  frame: number;
  fps: number;
  color: string;
  fillOpacity: number;
  startDelay: number;
}) {
  const drawProgress = interpolate(
    frame,
    [startDelay * fps, (startDelay + 1.5) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const visibleCount = Math.ceil(drawProgress * points.length);

  if (visibleCount < 2) return null;

  const visible = points.slice(0, visibleCount);
  const lastX = ((visibleCount - 1) / (points.length - 1)) * 400;

  const linePoints = visible
    .map((val, i) => {
      const x = (i / (points.length - 1)) * 400;
      const y = 95 - (val / 100) * 90;
      return `${x},${y}`;
    })
    .join(" ");

  const d = `M0,95 L${linePoints} L${lastX},95 Z`;

  return <path d={d} fill={color} opacity={fillOpacity} />;
}
