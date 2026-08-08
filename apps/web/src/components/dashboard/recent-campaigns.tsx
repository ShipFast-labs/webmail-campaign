import { format } from "date-fns";
import { motion } from "motion/react";

import { useCampaigns } from "@/hooks/use-campaigns";
import type { CampaignStatus } from "@/api/campaigns";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

export function DashboardRecentCampaigns() {
  const { data: campaigns, isLoading } = useCampaigns();

  return (
    <motion.div {...fadeUp(0.4)} className="lg:col-span-1 h-full">
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
              {isLoading ? (
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
                      <div className="text-[10px] text-muted-foreground font-normal mt-0.5">
                        {format(new Date(camp.createdAt), "MMM d, yyyy")}
                      </div>
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
  );
}
