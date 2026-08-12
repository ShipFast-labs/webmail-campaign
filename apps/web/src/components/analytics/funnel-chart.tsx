import { motion } from "motion/react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useCampaignAnalytics } from "@/hooks/use-analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeUp } from "@/lib/motion";

const funnelChartConfig = {
  value: {
    label: "Recipients",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function CampaignFunnelChart({ campaignId }: { campaignId: string }) {
  const { data: analytics, isLoading } = useCampaignAnalytics(campaignId);

  const funnelData = analytics ? [
    { stage: "Sent", value: analytics.totalSent },
    { stage: "Delivered", value: analytics.totalDelivered },
    { stage: "Opened", value: analytics.totalOpened },
    { stage: "Clicked", value: analytics.totalClicked },
  ] : [];

  return (
    <motion.div {...fadeUp(0.3)}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>Drop-off from Sent to Clicked</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="w-full h-[300px]" />
          ) : (
            <ChartContainer config={funnelChartConfig} className="w-full h-[300px]">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="stage" 
                  type="category" 
                  tickLine={false} 
                  axisLine={false} 
                  stroke="var(--foreground)"
                  fontSize={13}
                />
                <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} maxBarSize={40} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
