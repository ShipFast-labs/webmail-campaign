import { motion } from "motion/react";
import { useCampaignAnalytics } from "@/hooks/use-analytics";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeUp } from "@/lib/motion";

function rate(num: number, denom: number): string {
  return denom === 0 ? "—" : ((num / denom) * 100).toFixed(1) + "%";
}

export function CampaignKpis({ campaignId }: { campaignId: string }) {
  const { data: analytics, isLoading } = useCampaignAnalytics(campaignId);

  const kpis = analytics
    ? [
        { label: "Delivery Rate", value: rate(analytics.totalDelivered, analytics.totalSent) },
        { label: "Open Rate", value: rate(analytics.totalOpened, analytics.totalDelivered) },
        { label: "Click Rate", value: rate(analytics.totalClicked, analytics.totalOpened) },
        { label: "Bounce Rate", value: rate(analytics.totalBounced, analytics.totalSent) },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <motion.div key={kpi.label} {...fadeUp(0.1 + i * 0.1)}>
          <Card>
            <CardContent className="p-5 flex flex-col justify-center">
              <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
