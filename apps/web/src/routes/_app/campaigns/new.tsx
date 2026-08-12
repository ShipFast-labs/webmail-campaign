import { createFileRoute, Link } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { CampaignBuilder } from "@/components/campaigns/campaign-builder";

export const Route = createFileRoute("/_app/campaigns/new")({
  component: CampaignNewPage,
});

function CampaignNewPage() {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-4 shrink-0">
        <Button variant="outline" size="icon" asChild className="h-8 w-8 text-muted-foreground">
          <Link to="/campaigns">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Campaign</h1>
          <p className="text-sm text-muted-foreground">Configure and send a new email campaign.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-card rounded-xl border shadow-sm overflow-hidden">
        <CampaignBuilder />
      </div>
    </div>
  );
}
