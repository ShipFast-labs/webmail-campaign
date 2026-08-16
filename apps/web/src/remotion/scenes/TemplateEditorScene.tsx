import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS, SPRING_CONFIGS } from "../constants";
import { AppFrame } from "./AppFrame";

const SUBJECT_TEXT = "Welcome to NamiSend, {{firstName}}!";
const HTML_LINES = [
  '<h2>Hey {{firstName}} 👋</h2>',
  '<p>Welcome aboard! We\'re</p>',
  '<p>glad you\'re here.</p>',
  '<a href="{{unsubscribeUrl}}">',
  '  Get Started →',
  '</a>',
];

export function TemplateEditorScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingOpacity = interpolate(frame, [0.3 * fps, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const editorAppear = spring({ frame: frame - 0.7 * fps, fps, config: SPRING_CONFIGS.smooth });

  const subjectLen = Math.floor(
    interpolate(frame, [35, 70], [0, SUBJECT_TEXT.length], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }),
  );

  const linesVisible = Math.floor(
    interpolate(frame, [75, 120], [0, HTML_LINES.length], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }),
  );

  const previewOpacity = interpolate(frame, [90, 115], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

  return (
    <AppFrame activeItem="Templates" animateIn={false}>
      {/* Page header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ opacity: headingOpacity }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: COLORS.inkBlack }}>Template Editor</div>
          <div style={{ fontSize: 12, color: COLORS.stoneGray, marginTop: 2 }}>Welcome Email</div>
        </div>
      </div>

      {/* Subject bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        backgroundColor: COLORS.offWhite,
        border: `1px solid ${COLORS.hairlineMist}`,
        borderRadius: "8px 8px 0 0",
        padding: "8px 14px",
        opacity: editorAppear,
      }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: COLORS.stoneGray, whiteSpace: "nowrap" }}>Subject</span>
        <span style={{ fontSize: 13, color: COLORS.inkBlack }}>
          {SUBJECT_TEXT.slice(0, subjectLen)}
          {subjectLen < SUBJECT_TEXT.length && cursorBlink && "|"}
        </span>
      </div>

      {/* Editor + Preview split */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        border: `1px solid ${COLORS.hairlineMist}`,
        borderTop: "none",
        borderRadius: "0 0 8px 8px",
        overflow: "hidden",
        opacity: editorAppear,
        height: 300,
      }}>
        {/* Code pane */}
        <div style={{ backgroundColor: "#282c34", display: "flex", flexDirection: "column", borderRight: "1px solid #3e4451" }}>
          {/* Pane header */}
          <div style={{ height: 28, backgroundColor: "#21252b", borderBottom: "1px solid #3e4451", display: "flex", alignItems: "center", padding: "0 12px", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#febc2e" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#28c840" }} />
            <span style={{ fontSize: 10, color: "#636d83", marginLeft: 8, fontFamily: FONTS.mono }}>template.html</span>
          </div>
          {/* Code lines */}
          <div style={{ padding: "12px 14px", flex: 1, fontFamily: FONTS.mono, fontSize: 11, lineHeight: 1.8 }}>
            {HTML_LINES.slice(0, linesVisible).map((line, i) => {
              const isTag = line.trim().startsWith("<");
              const isAttr = line.includes("href");
              const isComment = line.includes("{{");
              return (
                <div key={i} style={{
                  color: isAttr ? "#98c379" : isComment ? "#e5c07b" : isTag ? "#e06c75" : "#abb2bf",
                  whiteSpace: "pre",
                }}>
                  {line}
                </div>
              );
            })}
            {linesVisible < HTML_LINES.length && cursorBlink && (
              <span style={{ color: "#abb2bf" }}>|</span>
            )}
          </div>
        </div>

        {/* Preview pane */}
        <div style={{ backgroundColor: "#f4f4f5", display: "flex", flexDirection: "column", opacity: previewOpacity }}>
          <div style={{ height: 28, backgroundColor: COLORS.offWhite, borderBottom: `1px solid ${COLORS.hairlineMist}`, display: "flex", alignItems: "center", padding: "0 12px" }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: COLORS.stoneGray }}>Preview</span>
          </div>
          <div style={{ flex: 1, padding: 16, display: "flex", justifyContent: "center" }}>
            {/* Email card */}
            <div style={{
              width: "100%", backgroundColor: COLORS.offWhite,
              borderRadius: 8, border: `1px solid ${COLORS.hairlineMist}`,
              overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>
              <div style={{ backgroundColor: COLORS.forestInk, padding: "12px 18px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.highlighterYellow, fontFamily: FONTS.display }}>NamiSend</div>
              </div>
              <div style={{ padding: "14px 18px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.inkBlack, marginBottom: 6 }}>Hey Sarah 👋</div>
                <div style={{ fontSize: 11, color: COLORS.stoneGray, lineHeight: 1.6, marginBottom: 12 }}>
                  Welcome aboard! We're glad you're here. Your account is ready.
                </div>
                <div style={{
                  display: "inline-block",
                  backgroundColor: COLORS.forestInk, color: COLORS.highlighterYellow,
                  fontSize: 11, fontWeight: 600, padding: "6px 14px", borderRadius: 6,
                }}>
                  Get Started →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
