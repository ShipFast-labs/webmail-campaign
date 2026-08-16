import { createFileRoute, Link } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";

import { CampaignKpis } from "@/components/analytics/campaign-kpis";
import { CampaignFunnelChart } from "@/components/analytics/funnel-chart";
import { CampaignEngagementTimeline } from "@/components/analytics/engagement-timeline";
import { CampaignRecipientTable } from "@/components/analytics/recipient-table";

export const Route = createFileRoute("/_app/campaigns/$campaignId/analytics")({
  component: CampaignAnalyticsPage,
});

function CampaignAnalyticsPage() {
  const { campaignId } = Route.useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="text-muted-foreground h-9 w-9">
          <Link to="/campaigns">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Campaign Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Detailed performance report</p>
        </div>
      </div>

      <CampaignKpis campaignId={campaignId} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignFunnelChart campaignId={campaignId} />
        <CampaignEngagementTimeline campaignId={campaignId} />
      </div>

      <CampaignRecipientTable campaignId={campaignId} />
    </div>
  );
}
