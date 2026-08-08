import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cursor01Icon, MailBlock01Icon, MailOpen01Icon, MailSend01Icon } from "@hugeicons/core-free-icons";

import { useDashboardKpi } from "@/hooks/use-analytics";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] } as any,
});

export function DashboardKpiCards() {
  const { data: kpi, isLoading } = useDashboardKpi();

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpiCards.map(({ label, value, trend, trendUp, trendGood, icon, iconColor, iconBg }, i) => (
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
  );
}
