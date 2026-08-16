import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartHistogramIcon, Calendar01Icon } from "@hugeicons/core-free-icons";

import { useCampaigns } from "@/hooks/use-campaigns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/analytics")({
  component: GlobalAnalyticsPage,
});

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] } as any,
});

function GlobalAnalyticsPage() {
  const { data: campaigns, isLoading } = useCampaigns();

  // Filter out drafts or scheduled, we only want campaigns that have started sending or are completed
  const analyticsReadyCampaigns = campaigns?.filter(
    (c) => c.status === "COMPLETED" || c.status === "SENDING"
  ) || [];

  return (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Campaign Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select a specific campaign to view detailed performance, funnels, and recipient activity.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : analyticsReadyCampaigns.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <HugeiconsIcon icon={ChartHistogramIcon} size={48} className="text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No analytics available yet</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">
              You haven't sent any campaigns yet. Once a campaign starts sending or is completed, its analytics will appear here.
            </p>
            <Button variant="outline" className="mt-6" asChild>
              <Link to="/campaigns/$campaignId/analytics" params={{ campaignId: "mock-1" }}>
                <HugeiconsIcon icon={ChartHistogramIcon} size={16} className="mr-2" />
                View Mock Analytics Demo
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsReadyCampaigns.map((camp, i) => (
            <motion.div key={camp.id} {...fadeUp(0.1 + i * 0.05)}>
              <Link to="/campaigns/$campaignId/analytics" params={{ campaignId: camp.id }}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                      {camp.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                      {camp.subject}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <HugeiconsIcon icon={Calendar01Icon} size={14} className="mr-2" />
                      {format(new Date(camp.createdAt), "MMM d, yyyy")}

                      <div className="ml-auto flex items-center text-primary font-medium text-xs">
                        View Report &rarr;
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
