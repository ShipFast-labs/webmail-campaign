import { AbsoluteFill, Sequence } from "remotion";
import { TIMING } from "./constants";
import { DashboardScene } from "./scenes/DashboardScene";
import { CampaignScene } from "./scenes/CampaignScene";
import { AnalyticsScene } from "./scenes/AnalyticsScene";

const { scenes } = TIMING;

export function HeroDemo() {
  return (
    <AbsoluteFill>
      {/* Scene 1: Dashboard */}
      <Sequence
        from={scenes.dashboard.start}
        durationInFrames={scenes.dashboard.end - scenes.dashboard.start}
      >
        <DashboardScene />
      </Sequence>

      {/* Scene 2: Campaigns */}
      <Sequence
        from={scenes.campaign.start}
        durationInFrames={scenes.campaign.end - scenes.campaign.start}
      >
        <CampaignScene />
      </Sequence>

      {/* Scene 3: Analytics */}
      <Sequence
        from={scenes.analytics.start}
        durationInFrames={scenes.analytics.end - scenes.analytics.start}
      >
        <AnalyticsScene />
      </Sequence>
    </AbsoluteFill>
  );
}
