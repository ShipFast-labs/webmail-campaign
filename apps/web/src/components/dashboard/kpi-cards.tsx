import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cursor01Icon, MailBlock01Icon, MailOpen01Icon, MailSend01Icon } from "@hugeicons/core-free-icons";

import { useDashboardKpi } from "@/hooks/use-analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeUp } from "@/lib/motion";

const CARD_FILLS = [
  "var(--color-sticky-note-mint)",
  "var(--color-sticky-note-teal)",
  "var(--color-sticky-note-blush)",
  "var(--color-highlighter-yellow)",
];

export function DashboardKpiCards() {
  const { data: kpi, isLoading } = useDashboardKpi();

  const kpiCards = kpi
    ? [
        {
          label: "Total Sent",
          value: kpi.totalSent.toLocaleString(),
          trend: `${kpi.sentTrend > 0 ? "+" : ""}${kpi.sentTrend}%`,
          trendGood: kpi.sentTrend > 0,
          icon: MailSend01Icon,
        },
        {
          label: "Open Rate",
          value: `${(kpi.openRate * 100).toFixed(1)}%`,
          trend: `${kpi.openRateTrend > 0 ? "+" : ""}${kpi.openRateTrend}%`,
          trendGood: kpi.openRateTrend > 0,
          icon: MailOpen01Icon,
        },
        {
          label: "Click Rate",
          value: `${(kpi.clickRate * 100).toFixed(1)}%`,
          trend: `${kpi.clickRateTrend > 0 ? "+" : ""}${kpi.clickRateTrend}%`,
          trendGood: kpi.clickRateTrend > 0,
          icon: Cursor01Icon,
        },
        {
          label: "Bounce Rate",
          value: `${(kpi.bounceRate * 100).toFixed(1)}%`,
          trend: `${kpi.bounceRateTrend > 0 ? "+" : ""}${kpi.bounceRateTrend}%`,
          trendGood: kpi.bounceRateTrend < 0,
          icon: MailBlock01Icon,
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpiCards.map(({ label, value, trend, trendGood, icon }, i) => (
        <motion.div
          key={label}
          {...fadeUp(0.08 + i * 0.07)}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div
            className="h-full rounded-xl p-5 cursor-default"
            style={{
              backgroundColor: CARD_FILLS[i],
              border: "1px solid var(--color-forest-ink)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="text-xs font-medium text-foreground/60 mb-1"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {label}
                </p>
                <p
                  className="text-3xl text-foreground"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "0.02em" }}
                >
                  {value}
                </p>
                <p
                  className={`text-xs mt-2 font-medium ${trendGood ? "text-forest-ink" : "text-terracotta"}`}
                  style={{ color: trendGood ? "var(--color-forest-ink)" : "var(--color-terracotta)" }}
                >
                  {trendGood ? "↑" : "↓"} {trend} from last month
                </p>
              </div>
              <motion.span
                className="shrink-0 rounded-lg p-2.5"
                style={{ backgroundColor: "rgba(26,51,0,0.10)" }}
                whileHover={{ scale: 1.12, rotate: 6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <HugeiconsIcon icon={icon} size={20} primaryColor="var(--color-forest-ink)" />
              </motion.span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
