import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS, SPRING_CONFIGS, TIMING } from "../constants";
import { AppFrame } from "./AppFrame";

interface CampaignRow {
  name: string;
  subject: string;
  status: "DRAFT" | "SENDING" | "COMPLETED";
  date: string;
}

const CAMPAIGNS: CampaignRow[] = [
  {
    name: "Summer Sale Launch",
    subject: "☀️ 40% off everything — today only",
    status: "COMPLETED",
    date: "Aug 5, 2026",
  },
  {
    name: "Product Update v2.4",
    subject: "New features you've been asking for",
    status: "SENDING",
    date: "Aug 10, 2026",
  },
  {
    name: "Welcome Series — Day 1",
    subject: "Welcome aboard! Here's what to expect",
    status: "DRAFT",
    date: "Aug 12, 2026",
  },
];

const STATUS_STYLES: Record<
  CampaignRow["status"],
  { bg: string; color: string; label: string }
> = {
  COMPLETED: {
    bg: "rgba(34,197,94,0.1)",
    color: "#22c55e",
    label: "Completed",
  },
  SENDING: {
    bg: "rgba(249,115,22,0.1)",
    color: "#f97316",
    label: "Sending",
  },
  DRAFT: {
    bg: COLORS.hairlineMist,
    color: COLORS.stoneGray,
    label: "Draft",
  },
};

export function CampaignScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AppFrame activeItem="Campaigns">
      {/* Page heading */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
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
            Campaigns
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
            Manage and schedule your email campaigns.
          </div>
        </div>

        {/* Create Campaign button */}
        <div
          style={{
            backgroundColor: COLORS.inkBlack,
            color: COLORS.creamPaper,
            fontSize: 12,
            fontWeight: 600,
            padding: "8px 14px",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
            opacity: interpolate(frame, [0.6 * fps, 0.9 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `scale(${interpolate(
              frame,
              [0.6 * fps, 0.9 * fps],
              [0.9, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )})`,
          }}
        >
          <span style={{ fontSize: 14 }}>+</span>
          Create Campaign
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: COLORS.offWhite,
          border: `1px solid ${COLORS.hairlineMist}`,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            padding: "10px 16px",
            borderBottom: `1px solid ${COLORS.pencilGray}`,
            opacity: interpolate(frame, [0.7 * fps, 1.0 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {["Name", "Status", "Date", "Actions"].map((h) => (
            <div
              key={h}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: COLORS.stoneGray,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textAlign: h === "Actions" ? "right" : "left",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Table rows */}
        {CAMPAIGNS.map((campaign, i) => {
          const delay = 0.9 * fps + i * TIMING.stagger.tableRows;
          const rowProgress = spring({
            frame: frame - delay,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          const style = STATUS_STYLES[campaign.status];

          // "Send Now" button pulse for DRAFT row
          const sendPulse =
            campaign.status === "DRAFT"
              ? interpolate(
                  spring({
                    frame: frame - (delay + 25),
                    fps,
                    config: { damping: 10, stiffness: 100, mass: 1 },
                  }),
                  [0, 1],
                  [0.9, 1],
                )
              : 1;

          return (
            <div
              key={campaign.name}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                padding: "12px 16px",
                borderBottom:
                  i < CAMPAIGNS.length - 1
                    ? `1px solid ${COLORS.whisperGray}`
                    : "none",
                alignItems: "center",
                opacity: rowProgress,
                transform: `translateY(${interpolate(
                  rowProgress,
                  [0, 1],
                  [16, 0],
                )}px)`,
              }}
            >
              {/* Name */}
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLORS.inkBlack,
                  }}
                >
                  {campaign.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.stoneGray,
                    marginTop: 2,
                    maxWidth: 220,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {campaign.subject}
                </div>
              </div>

              {/* Status badge */}
              <div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    backgroundColor: style.bg,
                    color: style.color,
                  }}
                >
                  {style.label}
                </span>
              </div>

              {/* Date */}
              <div
                style={{
                  fontSize: 12,
                  color: COLORS.stoneGray,
                }}
              >
                {campaign.date}
              </div>

              {/* Actions */}
              <div style={{ textAlign: "right" }}>
                {campaign.status === "DRAFT" && (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      border: `1px solid ${COLORS.hairlineMist}`,
                      color: COLORS.inkBlack,
                      transform: `scale(${sendPulse})`,
                      backgroundColor: COLORS.offWhite,
                    }}
                  >
                    ▶ Send Now
                  </span>
                )}
                {campaign.status === "COMPLETED" && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: COLORS.skyPop,
                    }}
                  >
                    Analytics →
                  </span>
                )}
                {campaign.status === "SENDING" && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: COLORS.stoneGray,
                    }}
                  >
                    ⏸ Pause
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppFrame>
  );
}
