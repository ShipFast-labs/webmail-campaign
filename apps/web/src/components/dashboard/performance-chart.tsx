import { format } from "date-fns";
import { motion } from "motion/react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useDashboardTimeSeries } from "@/hooks/use-analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeUp } from "@/lib/motion";

const chartConfig = {
  sends: {
    label: "Sends",
    color: "var(--color-forest-ink)",
  },
  opens: {
    label: "Opens",
    color: "var(--color-sticky-note-teal)",
  },
} satisfies ChartConfig;

export function DashboardPerformanceChart() {
  const { data: timeseries, isLoading } = useDashboardTimeSeries();

  return (
    <motion.div {...fadeUp(0.3)} className="lg:col-span-2 h-full">
      <Card className="h-full flex flex-col">
        <CardHeader
          className="pb-4"
          style={{ borderBottom: "1px solid var(--color-pencil-gray)" }}
        >
          <CardTitle
            style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "16px" }}
          >
            Performance Overview
          </CardTitle>
          <CardDescription>Sends and opens — last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 min-h-[300px]">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center p-6">
              <Skeleton className="w-full h-[250px] rounded-lg" />
            </div>
          ) : !timeseries?.length ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              No data available yet.
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-full w-full max-h-[350px] p-4">
              <AreaChart data={timeseries} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="fillSends" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-sends)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--color-sends)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillOpens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-opens)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-opens)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--color-pencil-gray)"
                  opacity={0.4}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  fontFamily="var(--font-mono)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  fontFamily="var(--font-mono)"
                />
                <ChartTooltip
                  cursor={{ stroke: "var(--color-pencil-gray)", strokeWidth: 1, strokeDasharray: "4 4" }}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(val) => format(new Date(val as string), "MMM d, yyyy")}
                    />
                  }
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
