import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { ContactsScene } from "./scenes/ContactsScene";
import { ListScene } from "./scenes/ListScene";
import { TemplateEditorScene } from "./scenes/TemplateEditorScene";
import { CampaignWizardScene } from "./scenes/CampaignWizardScene";
import { AnalyticsScene } from "./scenes/AnalyticsScene";

const SCENE_DURATION = 150; // 5s per scene at 30fps
const FADE = 12; // frames to cross-fade between scenes
export const HOW_IT_WORKS_DURATION = SCENE_DURATION * 5;

function FadeSequence({
  from,
  children,
}: {
  from: number;
  children: React.ReactNode;
}) {
  const frame = useCurrentFrame();
  // Each Sequence resets frame to 0, so fade-in is frame 0→FADE
  const opacity = interpolate(frame, [0, FADE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Sequence from={from} durationInFrames={SCENE_DURATION}>
      <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>
    </Sequence>
  );
}

export function HowItWorksDemo() {
  return (
    <AbsoluteFill>
      {/* Scene 1 — no fade-in, starts immediately */}
      <Sequence from={0} durationInFrames={SCENE_DURATION}>
        <ContactsScene />
      </Sequence>

      <FadeSequence from={SCENE_DURATION * 1}><ListScene /></FadeSequence>
      <FadeSequence from={SCENE_DURATION * 2}><TemplateEditorScene /></FadeSequence>
      <FadeSequence from={SCENE_DURATION * 3}><CampaignWizardScene /></FadeSequence>
      <FadeSequence from={SCENE_DURATION * 4}><AnalyticsScene /></FadeSequence>
    </AbsoluteFill>
  );
}
