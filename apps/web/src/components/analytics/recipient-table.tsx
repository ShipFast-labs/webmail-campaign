import { useState } from "react";
import { format } from "date-fns";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";

import { useCampaignRecipients } from "@/hooks/use-analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const STATUS_BADGE: Record<string, string> = {
  SENT: "bg-gray-500/10 text-gray-500",
  DELIVERED: "bg-blue-500/10 text-blue-500",
  OPENED: "bg-green-500/10 text-green-600",
  CLICKED: "bg-purple-500/10 text-purple-600",
  BOUNCED: "bg-amber-500/10 text-amber-600",
  UNSUBSCRIBED: "bg-red-500/10 text-red-600",
  FAILED: "bg-destructive/10 text-destructive",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] } as any,
});

export function CampaignRecipientTable({ campaignId }: { campaignId: string }) {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  
  const { data: recipientsRes, isLoading } = useCampaignRecipients(campaignId, page, pageSize);

  return (
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
              {isLoading ? (
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
                  disabled={page === 0 || isLoading}
                >
                  <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="mr-1" /> Prev
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= (recipientsRes.pagination.totalPages - 1) || isLoading}
                >
                  Next <HugeiconsIcon icon={ArrowRight02Icon} size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
