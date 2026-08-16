import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS, SPRING_CONFIGS, TIMING } from "../constants";
import { AppFrame } from "./AppFrame";

const LIST_NAME = "Newsletter Subscribers";

const EXISTING_LISTS = [
  { name: "All Customers", count: 1284, updated: "Aug 14, 2026" },
  { name: "VIP Members", count: 342, updated: "Aug 12, 2026" },
];

export function ListScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingProgress = spring({ frame: frame - 15, fps, config: SPRING_CONFIGS.smooth });
  const row0 = spring({ frame: frame - 22, fps, config: SPRING_CONFIGS.snappy });
  const row1 = spring({ frame: frame - 22 - TIMING.stagger.tableRows, fps, config: SPRING_CONFIGS.snappy });
  const btnProgress = spring({ frame: frame - 30, fps, config: SPRING_CONFIGS.smooth });

  const btnClick = interpolate(
    spring({ frame: frame - 52, fps, config: { damping: 10, stiffness: 300, mass: 0.4 } }),
    [0, 0.35, 1], [1, 0.88, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const dialogProgress = spring({ frame: frame - 58, fps, config: SPRING_CONFIGS.snappy });
  const nameLen = Math.floor(
    interpolate(frame, [68, 95], [0, LIST_NAME.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const checkProgress = spring({ frame: frame - 100, fps, config: SPRING_CONFIGS.snappy });
  const createProgress = spring({ frame: frame - 110, fps, config: SPRING_CONFIGS.snappy });
  const newRowProgress = spring({ frame: frame - 125, fps, config: SPRING_CONFIGS.bouncy });

  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  const rows = [
    { data: EXISTING_LISTS[0], progress: row0 },
    { data: EXISTING_LISTS[1], progress: row1 },
  ];

  return (
    <AppFrame activeItem="Lists" animateIn={false}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ opacity: headingProgress, transform: `translateY(${interpolate(headingProgress, [0, 1], [10, 0])}px)` }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: COLORS.inkBlack }}>Lists</div>
          <div style={{ fontSize: 12, color: COLORS.stoneGray, marginTop: 2 }}>Organise contacts into audiences</div>
        </div>

        <div style={{
          fontSize: 12, fontWeight: 500, padding: "7px 12px", borderRadius: 7,
          backgroundColor: COLORS.sunshinePop, color: COLORS.inkBlack,
          display: "flex", alignItems: "center", gap: 5,
          opacity: btnProgress,
          transform: `scale(${interpolate(btnProgress, [0, 1], [0.9, 1]) * btnClick})`,
        }}>
          + New List
        </div>
      </div>

      {/* Table */}
      <div style={{
        borderRadius: 24,
        backgroundColor: COLORS.offWhite,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr",
          padding: "0 16px", height: 40,
          borderBottom: `1px solid ${COLORS.pencilGray}`,
          alignItems: "center",
        }}>
          {["Name", "Contacts", "Last updated"].map(h => (
            <div key={h} style={{ fontSize: 13, fontWeight: 500, color: COLORS.inkBlack }}>{h}</div>
          ))}
        </div>

        {/* New list row */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr",
          padding: "12px 16px",
          borderBottom: `1px solid ${COLORS.whisperGray}`,
          alignItems: "center",
          backgroundColor: "rgba(142,212,98,0.1)",
          opacity: newRowProgress,
          transform: `translateY(${interpolate(newRowProgress, [0, 1], [-12, 0])}px) scale(${interpolate(newRowProgress, [0, 1], [0.97, 1])})`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.inkBlack }}>{LIST_NAME}</div>
          <div style={{ fontSize: 13, color: COLORS.stoneGray }}>247</div>
          <div style={{ fontSize: 12, color: COLORS.stoneGray }}>Just now</div>
        </div>

        {/* Existing rows */}
        {rows.map(({ data, progress }, i) => (
          <div key={data.name} style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr",
            padding: "12px 16px",
            borderBottom: i < rows.length - 1 ? `1px solid ${COLORS.whisperGray}` : "none",
            alignItems: "center",
            opacity: progress,
            transform: `translateY(${interpolate(progress, [0, 1], [10, 0])}px)`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.inkBlack }}>{data.name}</div>
            <div style={{ fontSize: 13, color: COLORS.stoneGray }}>{data.count.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: COLORS.stoneGray }}>{data.updated}</div>
          </div>
        ))}
      </div>

      {/* Create List dialog */}
      {frame >= 58 && (
        <>
          {/* Backdrop */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundColor: "rgba(0,0,0,0.2)",
            opacity: interpolate(dialogProgress, [0, 1], [0, 1]),
            zIndex: 39,
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: `translate(-50%, -50%) scale(${interpolate(dialogProgress, [0, 1], [0.9, 1])})`,
            opacity: dialogProgress,
            width: 300,
            backgroundColor: COLORS.offWhite,
            borderRadius: 12,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
            padding: "22px 20px",
            zIndex: 40,
            display: "flex", flexDirection: "column", gap: 16,
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.inkBlack }}>Create New List</div>

            {/* Name field */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.stoneGray, marginBottom: 5 }}>List Name</div>
              <div style={{
                border: `1.5px solid ${COLORS.inkBlack}`, borderRadius: 7,
                padding: "8px 10px", fontSize: 13,
                fontFamily: FONTS.mono, color: COLORS.inkBlack,
                backgroundColor: COLORS.offWhite, minHeight: 36,
              }}>
                {LIST_NAME.slice(0, nameLen)}{nameLen < LIST_NAME.length && cursorOn ? "|" : ""}
              </div>
            </div>

            {/* Add contacts toggle */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              opacity: checkProgress,
              transform: `translateX(${interpolate(checkProgress, [0, 1], [-6, 0])}px)`,
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: 4,
                backgroundColor: checkProgress > 0.5 ? COLORS.inkBlack : "transparent",
                border: `1.5px solid ${COLORS.inkBlack}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {checkProgress > 0.5 && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13, color: COLORS.inkBlack }}>Add contacts from All Customers</span>
            </div>

            {/* Create button */}
            <div style={{
              backgroundColor: COLORS.sunshinePop, color: COLORS.inkBlack,
              fontSize: 13, fontWeight: 500, padding: "10px 0", borderRadius: 7,
              textAlign: "center",
              opacity: createProgress,
              transform: `scale(${interpolate(createProgress, [0, 1], [0.92, 1])})`,
            }}>
              Create List
            </div>
          </div>
        </>
      )}
    </AppFrame>
  );
}
