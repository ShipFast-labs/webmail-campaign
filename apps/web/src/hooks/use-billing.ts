import { useQuery, useMutation } from "@tanstack/react-query";
import { billingApi } from "@/api/billing";
import { toast } from "sonner";

export function useCreditPackages() {
  return useQuery({
    queryKey: ["billing", "packages"],
    queryFn: () => billingApi.getCreditPackages(),
  });
}

export function useBalance() {
  return useQuery({
    queryKey: ["billing", "balance"],
    queryFn: () => billingApi.getBalance(),
  });
}

export function useCheckout() {
  return useMutation({
    mutationFn: (packId: string) => billingApi.createCheckoutSession(packId),
    onSuccess: (checkoutUrl) => {
      window.location.href = checkoutUrl;
    },
    onError: () => toast.error("Failed to start checkout"),
  });
}
