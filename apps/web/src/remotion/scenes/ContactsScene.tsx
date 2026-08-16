import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS, SPRING_CONFIGS, TIMING } from "../constants";
import { AppFrame } from "./AppFrame";

const CONTACTS = [
  { email: "james@acmecorp.io", name: "James Miller", status: "ACTIVE", tag: "Lead" },
  { email: "priya@acmecorp.io", name: "Priya Sharma", status: "ACTIVE", tag: "Customer" },
  { email: "tom@bounced.dev", name: "Tom Nguyen", status: "BOUNCED", tag: "" },
];

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  ACTIVE: { bg: "rgba(168,229,229,0.4)", text: COLORS.forestInk, border: "#a8e5e5" },
  BOUNCED: { bg: "rgba(255,112,93,0.15)", text: COLORS.terracotta, border: "rgba(255,112,93,0.4)" },
};

// What gets typed into the dialog fields
const EMAIL_TEXT = "sarah@example.com";
const FNAME_TEXT = "Sarah";
const LNAME_TEXT = "Chen";

export function ContactsScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingProgress = spring({ frame: frame - 15, fps, config: SPRING_CONFIGS.smooth });
  const row0 = spring({ frame: frame - 22, fps, config: SPRING_CONFIGS.snappy });
  const row1 = spring({ frame: frame - 22 - TIMING.stagger.tableRows, fps, config: SPRING_CONFIGS.snappy });
  const row2 = spring({ frame: frame - 22 - TIMING.stagger.tableRows * 2, fps, config: SPRING_CONFIGS.snappy });
  const btnProgress = spring({ frame: frame - 30, fps, config: SPRING_CONFIGS.smooth });

  // Button click at f52
  const btnClick = interpolate(
    spring({ frame: frame - 52, fps, config: { damping: 10, stiffness: 300, mass: 0.4 } }),
    [0, 0.35, 1], [1, 0.88, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Dialog scales in at f58
  const dialogProgress = spring({ frame: frame - 58, fps, config: SPRING_CONFIGS.snappy });

  // Email types f68 → f90
  const emailLen = Math.floor(
    interpolate(frame, [68, 90], [0, EMAIL_TEXT.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  // First name f93 → f106
  const fnameLen = Math.floor(
    interpolate(frame, [93, 106], [0, FNAME_TEXT.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  // Last name f108 → f118
  const lnameLen = Math.floor(
    interpolate(frame, [108, 118], [0, LNAME_TEXT.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

  // "Create contact" button lights up at f122
  const createBtnProgress = spring({ frame: frame - 122, fps, config: SPRING_CONFIGS.snappy });

  // New contact row appears in table at f132
  const newRowProgress = spring({ frame: frame - 132, fps, config: SPRING_CONFIGS.bouncy });

  const cursorOn = Math.floor(frame / 8) % 2 === 0;
  const showDialog = frame >= 58 && frame < 145;

  const rows = [
    { data: CONTACTS[0], progress: row0 },
    { data: CONTACTS[1], progress: row1 },
    { data: CONTACTS[2], progress: row2 },
  ];

  return (
    <AppFrame activeItem="Contacts">
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ opacity: headingProgress, transform: `translateY(${interpolate(headingProgress, [0, 1], [10, 0])}px)` }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: COLORS.inkBlack }}>Contacts</div>
          <div style={{ fontSize: 12, color: COLORS.stoneGray, marginTop: 2 }}>1,284 total</div>
        </div>
        <div style={{ display: "flex", gap: 8, opacity: btnProgress }}>
          <div style={{
            fontSize: 12, fontWeight: 500, padding: "7px 12px", borderRadius: 7,
            border: `1px solid ${COLORS.hairlineMist}`, color: COLORS.inkBlack,
            backgroundColor: COLORS.offWhite,
          }}>
            Import CSV
          </div>
          <div style={{
            fontSize: 12, fontWeight: 500, padding: "7px 12px", borderRadius: 7,
            backgroundColor: COLORS.sunshinePop, color: COLORS.inkBlack,
            transform: `scale(${btnClick})`,
          }}>
            + Add contact
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{
        borderRadius: 24, backgroundColor: COLORS.offWhite,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "2.5fr 1.8fr 1fr 1fr",
          padding: "0 16px", height: 40,
          borderBottom: `1px solid ${COLORS.pencilGray}`, alignItems: "center",
        }}>
          {["Email", "Name", "Status", "Tags"].map(h => (
            <div key={h} style={{ fontSize: 13, fontWeight: 500, color: COLORS.inkBlack }}>{h}</div>
          ))}
        </div>

        {/* New contact row */}
        <div style={{
          display: "grid", gridTemplateColumns: "2.5fr 1.8fr 1fr 1fr",
          padding: "10px 16px", borderBottom: `1px solid ${COLORS.whisperGray}`,
          alignItems: "center", backgroundColor: "rgba(142,212,98,0.1)",
          opacity: newRowProgress,
          transform: `translateY(${interpolate(newRowProgress, [0, 1], [-10, 0])}px)`,
        }}>
          <div style={{ fontSize: 13, color: COLORS.stoneGray }}>{EMAIL_TEXT}</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.inkBlack }}>{FNAME_TEXT} {LNAME_TEXT}</div>
          <StatusBadge status="ACTIVE" />
          <span />
        </div>

        {rows.map(({ data, progress }, i) => (
          <div key={data.email} style={{
            display: "grid", gridTemplateColumns: "2.5fr 1.8fr 1fr 1fr",
            padding: "10px 16px",
            borderBottom: i < rows.length - 1 ? `1px solid ${COLORS.whisperGray}` : "none",
            alignItems: "center", opacity: progress,
            transform: `translateY(${interpolate(progress, [0, 1], [10, 0])}px)`,
          }}>
            <div style={{ fontSize: 13, color: COLORS.stoneGray }}>{data.email}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.inkBlack }}>{data.name}</div>
            <StatusBadge status={data.status} />
            {data.tag
              ? <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20, backgroundColor: COLORS.whisperGray, color: COLORS.inkBlack, display: "inline-block" }}>{data.tag}</span>
              : <span />}
          </div>
        ))}
      </div>

      {/* Dialog — centered modal matching ContactFormModal */}
      {showDialog && (
        <>
          {/* Backdrop */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundColor: `rgba(0,0,0,${interpolate(dialogProgress, [0, 1], [0, 0.4])})`,
            zIndex: 39,
          }} />

          {/* Dialog box */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: `translate(-50%, -50%) scale(${interpolate(dialogProgress, [0, 1], [0.94, 1])})`,
            opacity: dialogProgress,
            width: 340,
            backgroundColor: COLORS.offWhite,
            borderRadius: 12,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
            zIndex: 40,
            overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{ padding: "18px 20px 0", borderBottom: "none" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.inkBlack }}>New Contact</div>
            </div>

            {/* Form */}
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.inkBlack }}>Email</div>
                <div style={{
                  border: `1px solid ${emailLen > 0 ? COLORS.inkBlack : COLORS.hairlineMist}`,
                  borderRadius: 7, padding: "8px 10px",
                  fontSize: 13, fontFamily: FONTS.mono, color: COLORS.inkBlack,
                  backgroundColor: COLORS.offWhite, minHeight: 36,
                }}>
                  {emailLen === 0
                    ? <span style={{ color: COLORS.stoneGray }}>john@example.com</span>
                    : <>{EMAIL_TEXT.slice(0, emailLen)}{emailLen < EMAIL_TEXT.length && cursorOn ? "|" : ""}</>
                  }
                </div>
              </div>

              {/* First name + Last name — 2-col grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.inkBlack }}>First name</div>
                  <div style={{
                    border: `1px solid ${fnameLen > 0 ? COLORS.inkBlack : COLORS.hairlineMist}`,
                    borderRadius: 7, padding: "8px 10px",
                    fontSize: 13, fontFamily: FONTS.mono, color: COLORS.inkBlack,
                    backgroundColor: COLORS.offWhite, minHeight: 36,
                  }}>
                    {fnameLen === 0 && emailLen < EMAIL_TEXT.length
                      ? <span style={{ color: COLORS.stoneGray }}>John</span>
                      : <>{FNAME_TEXT.slice(0, fnameLen)}{fnameLen < FNAME_TEXT.length && emailLen >= EMAIL_TEXT.length && cursorOn ? "|" : ""}</>
                    }
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.inkBlack }}>Last name</div>
                  <div style={{
                    border: `1px solid ${lnameLen > 0 ? COLORS.inkBlack : COLORS.hairlineMist}`,
                    borderRadius: 7, padding: "8px 10px",
                    fontSize: 13, fontFamily: FONTS.mono, color: COLORS.inkBlack,
                    backgroundColor: COLORS.offWhite, minHeight: 36,
                  }}>
                    {lnameLen === 0 && fnameLen < FNAME_TEXT.length
                      ? <span style={{ color: COLORS.stoneGray }}>Doe</span>
                      : <>{LNAME_TEXT.slice(0, lnameLen)}{lnameLen < LNAME_TEXT.length && fnameLen >= FNAME_TEXT.length && cursorOn ? "|" : ""}</>
                    }
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.inkBlack }}>
                  Tags <span style={{ fontSize: 11, color: COLORS.stoneGray }}>(comma separated)</span>
                </div>
                <div style={{
                  border: `1px solid ${COLORS.hairlineMist}`,
                  borderRadius: 7, padding: "8px 10px",
                  fontSize: 13, color: COLORS.stoneGray,
                  backgroundColor: COLORS.offWhite, minHeight: 36,
                }}>
                  vip, newsletter
                </div>
              </div>

              {/* Footer buttons */}
              <div style={{
                display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 4,
                opacity: createBtnProgress > 0.1 ? 1 : interpolate(dialogProgress, [0.5, 1], [0, 1]),
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 500, padding: "8px 14px", borderRadius: 7,
                  border: `1px solid ${COLORS.hairlineMist}`, color: COLORS.inkBlack,
                  backgroundColor: COLORS.offWhite,
                }}>
                  Cancel
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 500, padding: "8px 14px", borderRadius: 7,
                  backgroundColor: COLORS.sunshinePop, color: COLORS.inkBlack,
                  opacity: createBtnProgress,
                  transform: `scale(${interpolate(createBtnProgress, [0, 1], [0.94, 1])})`,
                }}>
                  Create contact
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AppFrame>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { bg: COLORS.whisperGray, text: COLORS.stoneGray, border: COLORS.hairlineMist };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px", borderRadius: 20,
      fontSize: 11, fontWeight: 500,
      backgroundColor: s.bg, color: s.text,
      border: `1px solid ${s.border}`,
    }}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
