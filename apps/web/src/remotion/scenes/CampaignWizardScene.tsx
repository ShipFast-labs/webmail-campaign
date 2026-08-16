import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS, SPRING_CONFIGS } from "../constants";
import { AppFrame } from "./AppFrame";

const WIZARD_STEPS = [
  { id: 1, title: "Details" },
  { id: 2, title: "Audience" },
  { id: 3, title: "Template" },
  { id: 4, title: "Schedule" },
];

// Text that gets typed into the form
const CAMPAIGN_NAME = "Welcome Series — Day 1";
const SUBJECT_TEXT = "Welcome aboard, {{firstName}}!";
const FROM_NAME = "NamiSend";
const FROM_EMAIL = "hello@namisend.com";

export function CampaignWizardScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingProgress = spring({ frame: frame - 15, fps, config: SPRING_CONFIGS.smooth });
  const cardProgress = spring({ frame: frame - 22, fps, config: SPRING_CONFIGS.smooth });

  // Active step advances: step 1 (f0-55), step 2 (f56-90), step 3 (f91-115), step 4 (f116+)
  const activeStep = frame < 56 ? 1 : frame < 91 ? 2 : frame < 116 ? 3 : 4;

  // Step 1 — typing fields
  const nameLen = Math.floor(
    interpolate(frame, [32, 58], [0, CAMPAIGN_NAME.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const subjectLen = Math.floor(
    interpolate(frame, [36, 62], [0, SUBJECT_TEXT.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const fromNameLen = Math.floor(
    interpolate(frame, [40, 52], [0, FROM_NAME.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const fromEmailLen = Math.floor(
    interpolate(frame, [44, 56], [0, FROM_EMAIL.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

  // Step content transitions
  const step2Progress = spring({ frame: frame - 56, fps, config: SPRING_CONFIGS.snappy });
  const step3Progress = spring({ frame: frame - 91, fps, config: SPRING_CONFIGS.snappy });
  const step4Progress = spring({ frame: frame - 116, fps, config: SPRING_CONFIGS.snappy });

  // Send button at f130
  const sendBtnProgress = spring({ frame: frame - 130, fps, config: SPRING_CONFIGS.bouncy });

  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  return (
    <AppFrame activeItem="Campaigns" animateIn={false}>
      {/* Page header — matches CampaignNewPage */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7,
          border: `1px solid ${COLORS.hairlineMist}`, backgroundColor: COLORS.offWhite,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: headingProgress,
        }}>
          <span style={{ fontSize: 14, color: COLORS.stoneGray }}>←</span>
        </div>
        <div style={{ opacity: headingProgress, transform: `translateY(${interpolate(headingProgress, [0, 1], [6, 0])}px)` }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: COLORS.inkBlack }}>Create Campaign</div>
          <div style={{ fontSize: 12, color: COLORS.stoneGray, marginTop: 2 }}>Configure and send a new email campaign.</div>
        </div>
      </div>

      {/* Campaign builder card — matches bg-card rounded-xl border shadow-sm */}
      <div style={{
        backgroundColor: COLORS.offWhite, borderRadius: 12,
        border: `1px solid ${COLORS.hairlineMist}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        overflow: "hidden",
        opacity: cardProgress,
        transform: `translateY(${interpolate(cardProgress, [0, 1], [12, 0])}px)`,
        display: "flex", flexDirection: "column",
        height: 380,
      }}>
        {/* Builder body: sidebar + content */}
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

          {/* Left sidebar — w-48 border-r bg-muted/20 p-6 */}
          <div style={{
            width: 160, borderRight: `1px solid ${COLORS.hairlineMist}`,
            backgroundColor: "rgba(0,0,0,0.02)",
            padding: "20px 18px", flexShrink: 0,
            display: "flex", flexDirection: "column", gap: 0,
          }}>
            {WIZARD_STEPS.map((s) => {
              const isActive = activeStep === s.id;
              const isDone = activeStep > s.id;
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  {/* Circle */}
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 11, fontWeight: 600,
                    backgroundColor: isActive
                      ? COLORS.sunshinePop
                      : isDone
                        ? `${COLORS.sunshinePop}55`
                        : "rgba(0,0,0,0.07)",
                    color: COLORS.inkBlack,
                  }}>
                    {isDone ? "✓" : s.id}
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 500,
                    color: isActive ? COLORS.inkBlack : isDone ? "rgba(0,0,0,0.6)" : COLORS.stoneGray,
                  }}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Main content area — p-6 */}
          <div style={{ flex: 1, padding: "20px 22px", overflow: "hidden" }}>

            {/* Step 1: Details */}
            {activeStep === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.inkBlack }}>Campaign Details</div>
                  <div style={{ fontSize: 12, color: COLORS.stoneGray, marginTop: 3 }}>Name your campaign and set the sender info.</div>
                </div>

                <FormInput label="Campaign Name" value={CAMPAIGN_NAME} len={nameLen} total={CAMPAIGN_NAME.length} cursor={cursorOn} placeholder="e.g. Summer Sale 2026" />
                <FormInput label="Subject Line" value={SUBJECT_TEXT} len={subjectLen} total={SUBJECT_TEXT.length} cursor={nameLen >= CAMPAIGN_NAME.length && cursorOn} placeholder="e.g. Don't miss these deals!" />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <FormInput label="From Name" value={FROM_NAME} len={fromNameLen} total={FROM_NAME.length} cursor={subjectLen >= SUBJECT_TEXT.length && cursorOn} placeholder="e.g. Acme Corp" />
                  <FormInput label="From Email" value={FROM_EMAIL} len={fromEmailLen} total={FROM_EMAIL.length} cursor={fromNameLen >= FROM_NAME.length && cursorOn} placeholder="hello@acmecorp.com" />
                </div>
              </div>
            )}

            {/* Step 2: Audience */}
            {activeStep === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, opacity: step2Progress, transform: `translateY(${interpolate(step2Progress, [0, 1], [8, 0])}px)` }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.inkBlack }}>Select Audience</div>
                  <div style={{ fontSize: 12, color: COLORS.stoneGray, marginTop: 3 }}>Choose which list to send this campaign to.</div>
                </div>
                {/* List options */}
                {[
                  { name: "Newsletter Subscribers", count: "247 contacts", selected: true },
                  { name: "All Customers", count: "1,284 contacts", selected: false },
                ].map(item => (
                  <div key={item.name} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    border: `1.5px solid ${item.selected ? COLORS.inkBlack : COLORS.hairlineMist}`,
                    borderRadius: 8, padding: "12px 14px",
                    backgroundColor: item.selected ? "rgba(0,0,0,0.02)" : COLORS.offWhite,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.inkBlack }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.stoneGray, marginTop: 2 }}>{item.count}</div>
                    </div>
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%",
                      border: `1.5px solid ${item.selected ? COLORS.inkBlack : COLORS.hairlineMist}`,
                      backgroundColor: item.selected ? COLORS.inkBlack : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {item.selected && <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: COLORS.offWhite }} />}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Template */}
            {activeStep === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, opacity: step3Progress, transform: `translateY(${interpolate(step3Progress, [0, 1], [8, 0])}px)` }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.inkBlack }}>Choose Template</div>
                  <div style={{ fontSize: 12, color: COLORS.stoneGray, marginTop: 3 }}>Select an email template for this campaign.</div>
                </div>
                {[
                  { name: "Welcome Email", preview: "Hey {{firstName}}, welcome aboard!", selected: true },
                  { name: "Monthly Newsletter", preview: "Here's what's new this month…", selected: false },
                ].map(item => (
                  <div key={item.name} style={{
                    border: `1.5px solid ${item.selected ? COLORS.inkBlack : COLORS.hairlineMist}`,
                    borderRadius: 8, padding: "12px 14px",
                    backgroundColor: item.selected ? "rgba(0,0,0,0.02)" : COLORS.offWhite,
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.inkBlack }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.stoneGray, marginTop: 2 }}>{item.preview}</div>
                    </div>
                    {item.selected && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.forestInk, backgroundColor: "rgba(142,212,98,0.2)", padding: "2px 8px", borderRadius: 20 }}>Selected</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Schedule */}
            {activeStep === 4 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, opacity: step4Progress, transform: `translateY(${interpolate(step4Progress, [0, 1], [8, 0])}px)` }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.inkBlack }}>Schedule or Send</div>
                  <div style={{ fontSize: 12, color: COLORS.stoneGray, marginTop: 3 }}>Choose when to send your campaign.</div>
                </div>
                {/* Toggle: send now vs schedule */}
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    { label: "Send Now", active: false },
                    { label: "Schedule", active: true },
                  ].map(opt => (
                    <div key={opt.label} style={{
                      flex: 1, padding: "10px 14px", borderRadius: 8, textAlign: "center",
                      border: `1.5px solid ${opt.active ? COLORS.inkBlack : COLORS.hairlineMist}`,
                      backgroundColor: opt.active ? "rgba(0,0,0,0.02)" : COLORS.offWhite,
                      fontSize: 13, fontWeight: opt.active ? 600 : 500,
                      color: opt.active ? COLORS.inkBlack : COLORS.stoneGray,
                    }}>
                      {opt.label}
                    </div>
                  ))}
                </div>
                {/* Date/time input */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.inkBlack, marginBottom: 5 }}>Send date & time</div>
                  <div style={{
                    border: `1px solid ${COLORS.hairlineMist}`, borderRadius: 7,
                    padding: "9px 12px", fontSize: 13, color: COLORS.inkBlack, backgroundColor: COLORS.offWhite,
                  }}>
                    Aug 18, 2026 · 9:00 AM
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer — border-t bg-card p-4 with Back + Next/Send */}
        <div style={{
          borderTop: `1px solid ${COLORS.hairlineMist}`,
          padding: "12px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          backgroundColor: COLORS.offWhite, flexShrink: 0,
        }}>
          <div style={{
            fontSize: 13, fontWeight: 500, padding: "7px 14px", borderRadius: 7,
            border: `1px solid ${COLORS.hairlineMist}`, color: activeStep === 1 ? COLORS.stoneGray : COLORS.inkBlack,
            backgroundColor: COLORS.offWhite, opacity: activeStep === 1 ? 0.5 : 1,
          }}>
            Back
          </div>

          {activeStep < 4 ? (
            <div style={{
              fontSize: 13, fontWeight: 500, padding: "7px 14px", borderRadius: 7,
              backgroundColor: COLORS.sunshinePop, color: COLORS.inkBlack,
              display: "flex", alignItems: "center", gap: 5,
            }}>
              Next →
            </div>
          ) : (
            <div style={{
              fontSize: 13, fontWeight: 500, padding: "7px 14px", borderRadius: 7,
              backgroundColor: COLORS.sunshinePop, color: COLORS.inkBlack,
              display: "flex", alignItems: "center", gap: 6,
              opacity: sendBtnProgress,
              transform: `scale(${interpolate(sendBtnProgress, [0, 1], [0.88, 1])})`,
            }}>
              📅 Schedule Campaign
            </div>
          )}
        </div>
      </div>
    </AppFrame>
  );
}

function FormInput({
  label, value, len, total, cursor, placeholder,
}: {
  label: string; value: string; len: number; total: number; cursor: boolean; placeholder: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.inkBlack }}>{label}</div>
      <div style={{
        border: `1px solid ${len > 0 ? COLORS.inkBlack : COLORS.hairlineMist}`,
        borderRadius: 7, padding: "8px 10px",
        fontSize: 13, fontFamily: FONTS.mono, color: COLORS.inkBlack,
        backgroundColor: COLORS.offWhite, minHeight: 36,
      }}>
        {len === 0
          ? <span style={{ color: COLORS.stoneGray }}>{placeholder}</span>
          : <>{value.slice(0, len)}{len < total && cursor ? "|" : ""}</>
        }
      </div>
    </div>
  );
}
