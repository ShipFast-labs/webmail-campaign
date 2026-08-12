import { format } from "date-fns";
import { motion } from "motion/react";

import { useCampaigns } from "@/hooks/use-campaigns";
import type { CampaignStatus } from "@/api/campaigns";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeUp } from "@/lib/motion";

const STATUS_PILL: Record<CampaignStatus, { bg: string; text: string; label: string }> = {
  COMPLETED: { bg: "var(--color-sticky-note-mint)", text: "var(--color-forest-ink)", label: "Completed" },
  SENDING:   { bg: "var(--color-highlighter-yellow)", text: "var(--color-forest-ink)", label: "Sending" },
  SCHEDULED: { bg: "var(--color-sticky-note-teal)", text: "var(--color-forest-ink)", label: "Scheduled" },
  DRAFT:     { bg: "var(--color-whisper-gray)", text: "var(--muted-foreground)", label: "Draft" },
  CANCELLED: { bg: "var(--color-sticky-note-blush)", text: "var(--color-terracotta)", label: "Cancelled" },
  PAUSED:    { bg: "var(--color-whisper-gray)", text: "var(--muted-foreground)", label: "Paused" },
};


export function DashboardRecentCampaigns() {
  const { data: campaigns, isLoading } = useCampaigns();

  return (
    <motion.div {...fadeUp(0.4)} className="lg:col-span-1 h-full">
      <Card className="h-full flex flex-col">
        <CardHeader
          className="pb-4"
          style={{ borderBottom: "1px solid var(--color-pencil-gray)" }}
        >
          <CardTitle style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "16px" }}>
            Recent Campaigns
          </CardTitle>
          <CardDescription>Your latest email sends</CardDescription>
        </CardHeader>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-xs"
                style={{
                  borderBottom: "1px solid var(--color-pencil-gray)",
                  color: "var(--muted-foreground)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <th className="text-left font-medium px-4 py-3">Campaign</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--color-whisper-gray)" }}>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-[120px]" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-[60px]" /></td>
                  </tr>
                ))
              ) : !campaigns?.length ? (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground text-sm">
                    No campaigns yet.
                  </td>
                </tr>
              ) : (
                campaigns.slice(0, 5).map((camp, i) => {
                  const pill = STATUS_PILL[camp.status];
                  return (
                    <motion.tr
                      key={camp.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.06, ease: "easeOut" }}
                      className="transition-colors"
                      style={{ borderBottom: "1px solid var(--color-whisper-gray)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,233,92,0.10)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = ""; }}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        <div className="truncate max-w-[150px] sm:max-w-[200px]" title={camp.name}>
                          {camp.name}
                        </div>
                        <div
                          className="text-[10px] font-normal mt-0.5"
                          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
                        >
                          {format(new Date(camp.createdAt), "MMM d, yyyy")}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: pill.bg,
                            color: pill.text,
                            fontFamily: "var(--font-mono)",
                            letterSpacing: "0.03em",
                          }}
                        >
                          {pill.label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
