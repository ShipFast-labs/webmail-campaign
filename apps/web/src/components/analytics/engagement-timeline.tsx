import { format } from "date-fns";
import { motion } from "motion/react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useCampaignTimeSeries } from "@/hooks/use-analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] } as any,
});

const timeSeriesChartConfig = {
  opens: {
    label: "Opens",
    color: "var(--chart-2)",
  },
  clicks: {
    label: "Clicks",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function CampaignEngagementTimeline({ campaignId }: { campaignId: string }) {
  const { data: timeseries, isLoading } = useCampaignTimeSeries(campaignId);

  return (
    <motion.div {...fadeUp(0.4)}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Engagement Timeline</CardTitle>
          <CardDescription>Opens and Clicks over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="w-full h-[300px]" />
          ) : (
            <ChartContainer config={timeSeriesChartConfig} className="w-full h-[300px]">
              <LineChart data={timeseries} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8}
                  tickFormatter={(value) => format(new Date(value), "MMM d")}
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8}
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="opens" stroke="var(--color-opens)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="clicks" stroke="var(--color-clicks)" strokeWidth={3} dot={false} />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
