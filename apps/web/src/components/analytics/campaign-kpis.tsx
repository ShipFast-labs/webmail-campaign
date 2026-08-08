import { motion } from "motion/react";
import { useCampaignAnalytics } from "@/hooks/use-analytics";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] } as any,
});

export function CampaignKpis({ campaignId }: { campaignId: string }) {
  const { data: analytics, isLoading } = useCampaignAnalytics(campaignId);

  const kpis = analytics ? [
    { label: "Delivery Rate", value: ((analytics.totalDelivered / analytics.totalSent) * 100).toFixed(1) + "%" },
    { label: "Open Rate", value: ((analytics.totalOpened / analytics.totalDelivered) * 100).toFixed(1) + "%" },
    { label: "Click Rate", value: ((analytics.totalClicked / analytics.totalOpened) * 100).toFixed(1) + "%" },
    { label: "Bounce Rate", value: ((analytics.totalBounced / analytics.totalSent) * 100).toFixed(1) + "%" },
  ] : [];

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
