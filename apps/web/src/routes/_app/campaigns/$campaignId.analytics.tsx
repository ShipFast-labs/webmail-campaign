import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { format } from "date-fns";
import { 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  ResponsiveContainer 
} from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ArrowLeft01Icon, 
  ChartHistogramIcon, 
  MailOpen01Icon, 
  Cursor01Icon, 
  MailBlock01Icon,
  ArrowRight01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon
} from "@hugeicons/core-free-icons";

import { 
  useCampaignAnalytics, 
  useCampaignTimeSeries, 
  useCampaignRecipients 
} from "@/hooks/use-analytics";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_app/campaigns/$campaignId/analytics")({
  component: CampaignAnalyticsPage,
});

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] } as any,
});

const funnelChartConfig = {
  value: {
    label: "Recipients",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

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

const STATUS_BADGE: Record<string, string> = {
  SENT: "bg-gray-500/10 text-gray-500",
  DELIVERED: "bg-blue-500/10 text-blue-500",
  OPENED: "bg-green-500/10 text-green-600",
  CLICKED: "bg-purple-500/10 text-purple-600",
  BOUNCED: "bg-amber-500/10 text-amber-600",
  UNSUBSCRIBED: "bg-red-500/10 text-red-600",
  FAILED: "bg-destructive/10 text-destructive",
};

function CampaignAnalyticsPage() {
  const { campaignId } = Route.useParams();
  
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data: analytics, isLoading: analyticsLoading } = useCampaignAnalytics(campaignId);
  const { data: timeseries, isLoading: tsLoading } = useCampaignTimeSeries(campaignId);
  const { data: recipientsRes, isLoading: recipientsLoading } = useCampaignRecipients(campaignId, page, pageSize);

  const funnelData = analytics ? [
    { stage: "Sent", value: analytics.totalSent },
    { stage: "Delivered", value: analytics.totalDelivered },
    { stage: "Opened", value: analytics.totalOpened },
    { stage: "Clicked", value: analytics.totalClicked },
  ] : [];

  const kpis = analytics ? [
    { label: "Delivery Rate", value: ((analytics.totalDelivered / analytics.totalSent) * 100).toFixed(1) + "%" },
    { label: "Open Rate", value: ((analytics.totalOpened / analytics.totalDelivered) * 100).toFixed(1) + "%" },
    { label: "Click Rate", value: ((analytics.totalClicked / analytics.totalOpened) * 100).toFixed(1) + "%" },
    { label: "Bounce Rate", value: ((analytics.totalBounced / analytics.totalSent) * 100).toFixed(1) + "%" },
  ] : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10 pt-4 md:pt-6">
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

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {analyticsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : (
          kpis.map((kpi, i) => (
            <motion.div key={kpi.label} {...fadeUp(0.1 + i * 0.1)}>
              <Card>
                <CardContent className="p-5 flex flex-col justify-center">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Chart */}
        <motion.div {...fadeUp(0.3)}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Drop-off from Sent to Clicked</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
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

        {/* Time Series Chart */}
        <motion.div {...fadeUp(0.4)}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Engagement Timeline</CardTitle>
              <CardDescription>Opens and Clicks over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {tsLoading ? (
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
      </div>

      {/* Recipient Table */}
      <motion.div {...fadeUp(0.5)}>
        <Card>
          <CardHeader>
            <CardTitle>Recipient Activity</CardTitle>
            <CardDescription>Detailed logs for all recipients in this campaign</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[30%]">Subscriber</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipientsLoading ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : !recipientsRes?.data?.length ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      No recipients found.
                    </TableCell>
                  </TableRow>
                ) : (
                  recipientsRes.data.map((recip) => (
                    <TableRow key={recip.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{recip.firstName} {recip.lastName}</span>
                          <span className="text-xs text-muted-foreground font-normal">{recip.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`border-0 font-semibold text-[10px] uppercase tracking-wider ${STATUS_BADGE[recip.status] || "bg-muted"}`}>
                          {recip.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {format(new Date(recip.updatedAt), "MMM d, h:mm a")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Pagination Controls */}
            {recipientsRes?.pagination && (
              <div className="p-4 border-t flex items-center justify-between bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{(page * pageSize) + 1}</span> to <span className="font-medium text-foreground">{Math.min((page + 1) * pageSize, recipientsRes.pagination.totalElements)}</span> of <span className="font-medium text-foreground">{recipientsRes.pagination.totalElements}</span> results
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0 || recipientsLoading}
                  >
                    <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="mr-1" /> Prev
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= (recipientsRes.pagination.totalPages - 1) || recipientsLoading}
                  >
                    Next <HugeiconsIcon icon={ArrowRight02Icon} size={14} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
