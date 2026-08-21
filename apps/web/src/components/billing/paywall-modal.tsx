import { HugeiconsIcon } from "@hugeicons/react";
import { Coins01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePaywallStore } from "@/store/paywall-store";
import { useCreditPackages, useCheckout } from "@/hooks/use-billing";

function formatPrice(priceCents: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(priceCents / 100);
}

export function PaywallModal() {
  const isOpen = usePaywallStore((s) => s.isOpen);
  const closePaywall = usePaywallStore((s) => s.closePaywall);
  const { data: packages, isLoading } = useCreditPackages();
  const checkout = useCheckout();

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && closePaywall()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Mail01Icon} size={20} className="text-primary" />
            <DialogTitle>You're out of email credits</DialogTitle>
          </div>
          <DialogDescription>
            Buy a credit pack to keep sending campaigns. Credits are spent once, when a
            campaign actually sends.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))
          ) : (
            packages?.map((pack) => (
              <button
                key={pack.id}
                type="button"
                disabled={checkout.isPending}
                onClick={() => checkout.mutate(pack.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-lg border border-border text-left transition-colors",
                  "hover:border-primary hover:bg-primary/5 disabled:opacity-60 disabled:pointer-events-none"
                )}
              >
                <div className="flex items-center gap-3">
                  <HugeiconsIcon icon={Coins01Icon} size={18} className="text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{pack.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {pack.credits.toLocaleString()} email credits
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-sm">
                  {formatPrice(pack.priceCents, pack.currency)}
                </p>
              </button>
            ))
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={closePaywall}
          disabled={checkout.isPending}
        >
          Maybe later
        </Button>
      </DialogContent>
    </Dialog>
  );
}
