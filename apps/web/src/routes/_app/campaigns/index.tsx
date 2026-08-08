import { createFileRoute, Link } from "@tanstack/react-router";
import { useCampaigns, useCancelCampaign, useSendCampaignNow } from "@/hooks/use-campaigns";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  PlusSignIcon, 
  PlayIcon, 
  Cancel01Icon,
  ChartHistogramIcon,
  Calendar01Icon
} from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import type { CampaignStatus } from "@/api/campaigns";

export const Route = createFileRoute("/_app/campaigns/")({
  component: CampaignsIndexPage,
});

function CampaignsIndexPage() {
  const { data: campaigns, isLoading } = useCampaigns();
  const sendNow = useSendCampaignNow();
  const cancelCampaign = useCancelCampaign();

  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case "DRAFT":
        return <Badge variant="outline" className="text-muted-foreground">Draft</Badge>;
      case "SCHEDULED":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Scheduled</Badge>;
      case "SENDING":
        return <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">Sending</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0">Cancelled</Badge>;
      case "PAUSED":
        return <Badge variant="secondary">Paused</Badge>;
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col max-w-6xl mx-auto w-full pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage and schedule your email campaigns.</p>
        </div>
        <Button asChild>
          <Link to="/campaigns/new">
            <HugeiconsIcon icon={PlusSignIcon} size={16} className="mr-2" />
            Create Campaign
          </Link>
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[30%]">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled / Sent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px] mb-2" />
                      <Skeleton className="h-3 w-[250px]" />
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-[80px] rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-[80px]" />
                        <Skeleton className="h-8 w-[80px]" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : !campaigns?.length ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <HugeiconsIcon icon={Calendar01Icon} size={32} className="mb-2 opacity-50" />
                      <p>No campaigns found.</p>
                      <Button variant="link" asChild className="mt-2">
                        <Link to="/campaigns/new">Create your first campaign</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                      <div>{campaign.name}</div>
                      <div className="text-xs text-muted-foreground font-normal mt-0.5 truncate max-w-[250px]">
                        {campaign.subject}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {campaign.status === "SCHEDULED" && campaign.scheduledAt
                        ? format(new Date(campaign.scheduledAt), "MMM d, yyyy h:mm a")
                        : campaign.status === "COMPLETED" 
                        ? format(new Date(campaign.createdAt), "MMM d, yyyy") // Mock completed date
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {campaign.status === "DRAFT" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs gap-1.5"
                          onClick={() => sendNow.mutate(campaign.id)}
                          disabled={sendNow.isPending}
                        >
                          <HugeiconsIcon icon={PlayIcon} size={14} />
                          Send Now
                        </Button>
                      )}
                      
                      {campaign.status === "SCHEDULED" && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                          onClick={() => cancelCampaign.mutate(campaign.id)}
                          disabled={cancelCampaign.isPending}
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={14} />
                          Cancel
                        </Button>
                      )}
                      
                      {campaign.status === "COMPLETED" && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs gap-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                          asChild
                        >
                          <Link to="/campaigns/$campaignId/analytics" params={{ campaignId: campaign.id }}>
                            <HugeiconsIcon icon={ChartHistogramIcon} size={14} />
                            Analytics
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
