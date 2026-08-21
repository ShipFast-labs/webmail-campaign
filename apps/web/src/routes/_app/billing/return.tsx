import { createFileRoute, Link } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/billing/return")({
  component: BillingReturnPage,
});

function BillingReturnPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 py-24 max-w-sm mx-auto">
      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={40} className="text-primary" />
      <div>
        <h1 className="text-xl font-semibold">Payment received</h1>
        <p className="text-sm text-muted-foreground mt-1">
          We're crediting your account now — this usually takes just a few seconds.
        </p>
      </div>
      <Button asChild>
        <Link to="/campaigns">Back to campaigns</Link>
      </Button>
    </div>
  );
}
