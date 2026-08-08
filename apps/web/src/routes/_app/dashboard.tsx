import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { motion } from "motion/react";

import { DashboardKpiCards } from "@/components/dashboard/kpi-cards";
import { DashboardPerformanceChart } from "@/components/dashboard/performance-chart";
import { DashboardRecentCampaigns } from "@/components/dashboard/recent-campaigns";

const searchParamsSchema = z.object({
  workspace: z.string().optional(),
});

export const Route = createFileRoute("/_app/dashboard")({
  validateSearch: (search) => searchParamsSchema.parse(search),
  component: DashboardPage,
});

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] } as any,
});

function DashboardPage() {
  const { workspace } = Route.useSearch();

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10 pt-4 md:pt-6">
      <motion.div {...fadeUp(0)}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {workspace ? `Viewing data for workspace: ${workspace}` : "Your campaign performance over the last 30 days."}
        </p>
      </motion.div>

      <DashboardKpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardPerformanceChart />
        <DashboardRecentCampaigns />
      </div>
    </div>
  );
}
