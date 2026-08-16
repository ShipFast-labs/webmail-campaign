import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ChartHistogramIcon,
  Cancel01Icon,
  PauseIcon,
  PlayIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";

import {
  useCampaign,
  useSendCampaignNow,
  useCancelCampaign,
  usePauseCampaign,
  useResumeCampaign,
} from "@/hooks/use-campaigns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeUp } from "@/lib/motion";
import type { CampaignStatus } from "@/api/campaigns";

export const Route = createFileRoute("/_app/campaigns/$campaignId/")({
  component: CampaignDetailPage,
});

const STATUS_STEPS: CampaignStatus[] = ["DRAFT", "SCHEDULED", "SENDING", "COMPLETED"];

const STATUS_BADGE: Record<CampaignStatus, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-muted text-muted-foreground" },
  SCHEDULED: { label: "Scheduled", className: "bg-blue-500/10 text-blue-500" },
  SENDING: { label: "Sending", className: "bg-orange-500/10 text-orange-500" },
  PAUSED: { label: "Paused", className: "bg-muted text-muted-foreground" },
  COMPLETED: { label: "Completed", className: "bg-green-500/10 text-green-600" },
  CANCELLED: { label: "Cancelled", className: "bg-red-500/10 text-red-500" },
};

function StatusPipeline({ status }: { status: CampaignStatus }) {
  const isTerminal = status === "CANCELLED" || status === "PAUSED";
  const activeIndex = isTerminal ? -1 : STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0">
      {STATUS_STEPS.map((step, i) => {
        const isActive = step === status;
        const isDone = activeIndex > i;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "w-2.5 h-2.5 rounded-full transition-colors",
                  isActive && !isTerminal
                    ? "bg-primary ring-2 ring-primary/30 ring-offset-1 ring-offset-card"
                    : isDone
                      ? "bg-primary/60"
                      : "bg-muted-foreground/20",
                ].join(" ")}
              />
              <span
                className={[
                  "text-[10px] font-medium whitespace-nowrap",
                  isActive && !isTerminal
                    ? "text-foreground"
                    : isDone
                      ? "text-foreground/60"
                      : "text-muted-foreground/50",
                ].join(" ")}
              >
                {step.charAt(0) + step.slice(1).toLowerCase()}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div
                className={[
                  "h-px w-12 sm:w-20 mx-1 mb-5 transition-colors",
                  isDone ? "bg-primary/40" : "bg-muted-foreground/15",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}

      {isTerminal && (
        <div className="ml-4 mb-5">
          <Badge
            variant="secondary"
            className={`border-0 ${STATUS_BADGE[status].className}`}
          >
            {STATUS_BADGE[status].label}
          </Badge>
        </div>
      )}
    </div>
  );
}

function CampaignDetailPage() {
  const { campaignId } = Route.useParams();
  const { data: campaign, isLoading } = useCampaign(campaignId);
  const sendNow = useSendCampaignNow();
  const cancel = useCancelCampaign();
  const pause = usePauseCampaign();
  const resume = useResumeCampaign();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-muted-foreground text-sm">Campaign not found.</div>
    );
  }

  const badge = STATUS_BADGE[campaign.status];
  const isPending =
    sendNow.isPending || cancel.isPending || pause.isPending || resume.isPending;

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div {...fadeUp(0)} className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="h-8 w-8 text-muted-foreground shrink-0"
        >
          <Link to="/campaigns">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight truncate">{campaign.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">{campaign.subject}</p>
        </div>
        <Badge
          variant="secondary"
          className={`ml-auto shrink-0 border-0 font-semibold ${badge.className}`}
        >
          {badge.label}
        </Badge>
      </motion.div>

      <motion.div {...fadeUp(0.08)}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <StatusPipeline status={campaign.status} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeUp(0.14)}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground mb-0.5">From</dt>
                <dd className="font-medium">
                  {campaign.fromName}{" "}
                  <span className="text-muted-foreground font-normal">
                    &lt;{campaign.fromEmail}&gt;
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Created</dt>
                <dd className="font-medium">
                  {format(new Date(campaign.createdAt), "MMM d, yyyy h:mm a")}
                </dd>
              </div>
              {campaign.scheduledAt && (
                <div>
                  <dt className="text-muted-foreground mb-0.5">Scheduled for</dt>
                  <dd className="font-medium">
                    {format(new Date(campaign.scheduledAt), "MMM d, yyyy h:mm a")}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground mb-0.5">Last updated</dt>
                <dd className="font-medium">
                  {format(new Date(campaign.updatedAt), "MMM d, yyyy h:mm a")}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeUp(0.2)} className="flex flex-wrap gap-2">
        {campaign.status === "DRAFT" && (
          <Button size="sm" onClick={() => sendNow.mutate(campaign.id)} disabled={isPending}>
            <HugeiconsIcon icon={Mail01Icon} size={14} />
            Send Now
          </Button>
        )}

        {campaign.status === "SENDING" && (
          <Button size="sm" variant="outline" onClick={() => pause.mutate(campaign.id)} disabled={isPending}>
            <HugeiconsIcon icon={PauseIcon} size={14} />
            Pause
          </Button>
        )}

        {campaign.status === "PAUSED" && (
          <Button size="sm" onClick={() => resume.mutate(campaign.id)} disabled={isPending}>
            <HugeiconsIcon icon={PlayIcon} size={14} />
            Resume
          </Button>
        )}

        {campaign.status === "COMPLETED" && (
          <Button size="sm" variant="outline" asChild>
            <Link to="/campaigns/$campaignId/analytics" params={{ campaignId: campaign.id }}>
              <HugeiconsIcon icon={ChartHistogramIcon} size={14} />
              View Analytics
            </Link>
          </Button>
        )}

        {(campaign.status === "DRAFT" ||
          campaign.status === "SCHEDULED" ||
          campaign.status === "SENDING" ||
          campaign.status === "PAUSED") && (
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => cancel.mutate(campaign.id)}
            disabled={isPending}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
            Cancel Campaign
          </Button>
        )}
      </motion.div>
    </div>
  );
}
