import { format } from "date-fns";
import { motion } from "motion/react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useDashboardTimeSeries } from "@/hooks/use-analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] } as any,
});

const chartConfig = {
  sends: {
    label: "Sends",
    color: "var(--primary)",
  },
  opens: {
    label: "Opens",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function DashboardPerformanceChart() {
  const { data: timeseries, isLoading } = useDashboardTimeSeries();

  return (
    <motion.div {...fadeUp(0.3)} className="lg:col-span-2 h-full">
      <Card className="h-full flex flex-col">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Sends and Opens over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 min-h-[300px]">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="w-[90%] h-[250px]" />
            </div>
          ) : !timeseries?.length ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-full w-full max-h-[350px] p-4">
              <AreaChart data={timeseries} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="fillSends" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-sends)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-sends)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="fillOpens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-opens)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-opens)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  }}
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
                <ChartTooltip
                  cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "4 4" }}
                  content={<ChartTooltipContent labelFormatter={(val) => format(new Date(val as string), "MMM d, yyyy")} />}
                />
                <Area
                  type="monotone"
                  dataKey="sends"
                  stroke="var(--color-sends)"
                  fillOpacity={1}
                  fill="url(#fillSends)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="opens"
                  stroke="var(--color-opens)"
                  fillOpacity={1}
                  fill="url(#fillOpens)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
