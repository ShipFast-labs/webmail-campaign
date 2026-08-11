import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";

import { DashboardKpiCards } from "@/components/dashboard/kpi-cards";
import { DashboardPerformanceChart } from "@/components/dashboard/performance-chart";
import { DashboardRecentCampaigns } from "@/components/dashboard/recent-campaigns";
import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] } as any,
});

function DashboardPage() {
  const workspace = useAuthStore((s) => s.workspace);

  return (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {workspace?.name
            ? `${workspace.name} — last 30 days`
            : "Your campaign performance over the last 30 days."}
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
