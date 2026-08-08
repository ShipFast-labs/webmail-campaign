import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { format } from "date-fns";
import { motion } from "motion/react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cursor01Icon,
  MailBlock01Icon,
  MailOpen01Icon,
  MailSend01Icon,
} from "@hugeicons/core-free-icons";

import { useDashboardKpi, useDashboardTimeSeries } from "@/hooks/use-analytics";
import { useCampaigns } from "@/hooks/use-campaigns";
import type { CampaignStatus } from "@/api/campaigns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const searchParamsSchema = z.object({
  workspace: z.string().optional(),
});

export const Route = createFileRoute("/_app/dashboard")({
  validateSearch: (search) => searchParamsSchema.parse(search),
  component: DashboardPage,
});

const STATUS_PILL: Record<CampaignStatus, string> = {
  COMPLETED: "bg-green-500/10 text-green-600 dark:text-green-400",
  SENDING: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  SCHEDULED: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  DRAFT: "bg-muted text-muted-foreground",
  CANCELLED: "bg-red-500/10 text-red-600 dark:text-red-400",
  PAUSED: "bg-muted text-muted-foreground",
};

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

function DashboardPage() {
  const { workspace } = Route.useSearch();
  const { data: kpi, isLoading: kpiLoading } = useDashboardKpi();
  const { data: timeseries, isLoading: tsLoading } = useDashboardTimeSeries();
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();

  const kpiCards = kpi ? [
    {
      label: "Total Sent",
      value: kpi.totalSent.toLocaleString(),
      trend: `${kpi.sentTrend > 0 ? '+' : ''}${kpi.sentTrend}%`,
      trendUp: kpi.sentTrend > 0,
      trendGood: kpi.sentTrend > 0,
      icon: MailSend01Icon,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Open Rate",
      value: `${kpi.openRate}%`,
      trend: `${kpi.openRateTrend > 0 ? '+' : ''}${kpi.openRateTrend}%`,
      trendUp: kpi.openRateTrend > 0,
      trendGood: kpi.openRateTrend > 0,
      icon: MailOpen01Icon,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      label: "Click Rate",
      value: `${kpi.clickRate}%`,
      trend: `${kpi.clickRateTrend > 0 ? '+' : ''}${kpi.clickRateTrend}%`,
      trendUp: kpi.clickRateTrend > 0,
      trendGood: kpi.clickRateTrend > 0,
      icon: Cursor01Icon,
      iconColor: "text-violet-500",
      iconBg: "bg-violet-500/10",
    },
    {
      label: "Bounce Rate",
      value: `${kpi.bounceRate}%`,
      trend: `${kpi.bounceRateTrend > 0 ? '+' : ''}${kpi.bounceRateTrend}%`,
      trendUp: kpi.bounceRateTrend > 0,
      trendGood: kpi.bounceRateTrend < 0,
      icon: MailBlock01Icon,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
    },
  ] : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10 pt-4 md:pt-6">
      <motion.div {...fadeUp(0)}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {workspace ? `Viewing data for workspace: ${workspace}` : "Your campaign performance over the last 30 days."}
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
          : kpiCards.map(({ label, value, trend, trendUp, trendGood, icon, iconColor, iconBg }, i) => (
              <motion.div
                key={label}
                {...fadeUp(0.08 + i * 0.07)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Card className="h-full cursor-default">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">{label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
                        <p className={`text-xs mt-1.5 font-medium ${trendGood ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                          {trendUp ? "↑" : "↓"} {trend} from last month
                        </p>
                      </div>
                      <motion.span
                        className={`shrink-0 rounded-lg p-2.5 ${iconBg} ${iconColor}`}
                        whileHover={{ scale: 1.12, rotate: 6 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <HugeiconsIcon icon={icon} size={20} />
                      </motion.span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div {...fadeUp(0.3)} className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Sends and Opens over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0 min-h-[300px]">
              {tsLoading ? (
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

        {/* Recent Campaigns */}
        <motion.div {...fadeUp(0.4)} className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Your latest email sends</CardDescription>
            </CardHeader>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left font-medium px-4 py-3">Campaign</th>
                    <th className="text-left font-medium px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/40">
                        <td className="px-4 py-3"><Skeleton className="h-4 w-[120px]" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-[60px]" /></td>
                      </tr>
                    ))
                  ) : !campaigns?.length ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground">
                        No recent campaigns.
                      </td>
                    </tr>
                  ) : (
                    campaigns.slice(0, 5).map((camp, i) => (
                      <motion.tr
                        key={camp.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.06, ease: "easeOut" }}
                        className="border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-foreground">
                          <div className="truncate max-w-[150px] sm:max-w-[200px]" title={camp.name}>{camp.name}</div>
                          <div className="text-[10px] text-muted-foreground font-normal mt-0.5">{format(new Date(camp.createdAt), "MMM d, yyyy")}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${STATUS_PILL[camp.status]}`}>
                            {camp.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
