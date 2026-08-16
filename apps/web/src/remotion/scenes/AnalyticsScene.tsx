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

const KPIS = [
  { label: "Delivery Rate", value: "99.2%", sub: "12,847 delivered" },
  { label: "Open Rate", value: "68.4%", sub: "8,791 opened" },
  { label: "Click Rate", value: "35.2%", sub: "3,094 clicked" },
  { label: "Bounce Rate", value: "0.8%", sub: "103 bounced" },
];

const FUNNEL = [
  { stage: "Sent", value: 12950, color: COLORS.forestInk },
  { stage: "Delivered", value: 12847, color: COLORS.stickyTeal },
  { stage: "Opened", value: 8791, color: COLORS.skyPop },
  { stage: "Clicked", value: 3094, color: "#a8e5e5" },
];
const FUNNEL_MAX = 12950;

const OPENS_DATA = [5, 8, 12, 35, 62, 78, 95, 88, 72, 55, 48, 42, 38, 45, 52, 48, 40, 35, 30, 25, 18, 12, 8, 5];

const RECIPIENTS = [
  { email: "sarah@example.com", status: "Clicked", opened: "9:02 AM" },
  { email: "james@acmecorp.io", status: "Opened", opened: "9:15 AM" },
  { email: "priya@acmecorp.io", status: "Opened", opened: "9:31 AM" },
  { email: "tom@bounced.dev", status: "Bounced", opened: "—" },
];

const RECIP_STATUS: Record<string, { bg: string; text: string }> = {
  Clicked: { bg: "rgba(43,160,255,0.15)", text: COLORS.skyPop },
  Opened: { bg: "rgba(168,229,229,0.35)", text: COLORS.forestInk },
  Bounced: { bg: "rgba(255,112,93,0.15)", text: COLORS.terracotta },
};

export function AnalyticsScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingOpacity = interpolate(frame, [0.3 * fps, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AppFrame activeItem="Analytics" animateIn={false}>
      {/* Heading */}
      <div style={{ marginBottom: 14, opacity: headingOpacity }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: COLORS.inkBlack }}>Campaign Analytics</div>
        <div style={{ fontSize: 12, color: COLORS.stoneGray, marginTop: 2 }}>Welcome Series — Day 1</div>
      </div>

      {/* KPI cards — grid-cols-4 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
        {KPIS.map((kpi, i) => {
          const delay = 0.5 * fps + i * TIMING.stagger.kpiCards;
          const p = spring({ frame: frame - delay, fps, config: SPRING_CONFIGS.smooth });
          const numProg = EASING.easeOutCubic(rangeProgress(frame, delay + 6, delay + 35));

          return (
            <div key={kpi.label} style={{
              backgroundColor: COLORS.offWhite,
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)",
              padding: "12px 14px",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px)`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: COLORS.stoneGray, marginBottom: 4 }}>{kpi.label}</div>
              <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: COLORS.inkBlack, lineHeight: 1.1 }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: 10, color: COLORS.stoneGray, marginTop: 3 }}>{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Two-column: Funnel + Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 10 }}>
        {/* Funnel — horizontal bar chart style */}
        <div style={{
          backgroundColor: COLORS.offWhite,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)",
          padding: "14px 16px",
          opacity: interpolate(frame, [1.4 * fps, 1.7 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.inkBlack, marginBottom: 2 }}>Conversion Funnel</div>
          <div style={{ fontSize: 11, color: COLORS.stoneGray, marginBottom: 12 }}>Sent → Clicked</div>
          {FUNNEL.map((f, i) => {
            const barDelay = 1.6 * fps + i * 8;
            const barProg = interpolate(frame, [barDelay, barDelay + 25], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            const widthPct = (f.value / FUNNEL_MAX) * 100 * barProg;
            return (
              <div key={f.stage} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: COLORS.stoneGray }}>{f.stage}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.inkBlack }}>{f.value.toLocaleString()}</span>
                </div>
                <div style={{ height: 8, backgroundColor: COLORS.whisperGray, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${widthPct}%`, backgroundColor: f.color, borderRadius: 4, transition: "width 0.1s" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Opens timeline */}
        <div style={{
          backgroundColor: COLORS.offWhite,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)",
          padding: "14px 16px",
          opacity: interpolate(frame, [1.5 * fps, 1.8 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.inkBlack, marginBottom: 2 }}>Opens over time</div>
          <div style={{ fontSize: 11, color: COLORS.stoneGray, marginBottom: 10 }}>Hourly — first 24 hours</div>
          <svg viewBox="0 0 300 80" style={{ width: "100%", height: 75, display: "block" }}>
            {[20, 40, 60].map(y => (
              <line key={y} x1={0} y1={y} x2={300} y2={y} stroke={COLORS.pencilGray} strokeWidth={0.5} strokeDasharray="3 3" opacity={0.4} />
            ))}
            <AnimatedArea data={OPENS_DATA} frame={frame} fps={fps} color={COLORS.stickyTeal} startDelay={1.8} />
          </svg>
        </div>
      </div>

      {/* Recipient table */}
      <div style={{
        marginTop: 10,
        borderRadius: 16,
        backgroundColor: COLORS.offWhite,
        boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)",
        overflow: "hidden",
        opacity: interpolate(frame, [2 * fps, 2.3 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
          padding: "0 16px", height: 36,
          borderBottom: `1px solid ${COLORS.pencilGray}`,
          alignItems: "center",
        }}>
          {["Email", "Status", "Opened at"].map(h => (
            <div key={h} style={{ fontSize: 12, fontWeight: 500, color: COLORS.inkBlack }}>{h}</div>
          ))}
        </div>
        {RECIPIENTS.map((r, i) => {
          const s = RECIP_STATUS[r.status] ?? { bg: COLORS.whisperGray, text: COLORS.stoneGray };
          const rowDelay = 2.1 * fps + i * 6;
          const rowProg = interpolate(frame, [rowDelay, rowDelay + 18], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          return (
            <div key={r.email} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
              padding: "8px 16px",
              borderBottom: i < RECIPIENTS.length - 1 ? `1px solid ${COLORS.whisperGray}` : "none",
              alignItems: "center",
              opacity: rowProg,
            }}>
              <div style={{ fontSize: 12, color: COLORS.stoneGray }}>{r.email}</div>
              <span style={{
                display: "inline-flex", alignItems: "center",
                padding: "2px 8px", borderRadius: 20,
                fontSize: 11, fontWeight: 500,
                backgroundColor: s.bg, color: s.text,
              }}>{r.status}</span>
              <div style={{ fontSize: 12, color: COLORS.stoneGray }}>{r.opened}</div>
            </div>
          );
        })}
      </div>
    </AppFrame>
  );
}

function AnimatedArea({ data, frame, fps, color, startDelay }: {
  data: number[]; frame: number; fps: number; color: string; startDelay: number;
}) {
  const drawProgress = interpolate(frame, [startDelay * fps, (startDelay + 1.2) * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const visibleCount = Math.max(2, Math.ceil(drawProgress * data.length));
  const visible = data.slice(0, visibleCount);
  const maxVal = Math.max(...data);

  const toPoint = (val: number, i: number) => {
    const x = (i / (data.length - 1)) * 300;
    const y = 75 - (val / maxVal) * 65;
    return `${x},${y}`;
  };

  const linePoints = visible.map(toPoint).join(" ");
  const lastX = ((visibleCount - 1) / (data.length - 1)) * 300;
  const areaD = `M0,75 L${linePoints} L${lastX},75 Z`;

  return (
    <>
      <path d={areaD} fill={color} opacity={0.2} />
      <polyline points={linePoints} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}
