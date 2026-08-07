import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignsApi, type CreateCampaignPayload } from "@/api/campaigns";
import { toast } from "sonner";

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: () => campaignsApi.listCampaigns(),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: () => campaignsApi.getCampaign(id),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) => campaignsApi.createCampaign(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign created successfully");
    },
    onError: () => toast.error("Failed to create campaign"),
  });
}

export function useSendCampaignNow() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => campaignsApi.sendNow(id),
    onSuccess: (campaign) => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      qc.invalidateQueries({ queryKey: ["campaign", campaign.id] });
      toast.success("Campaign is now sending!");
    },
    onError: () => toast.error("Failed to send campaign"),
  });
}

export function useCancelCampaign() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => campaignsApi.cancelCampaign(id),
    onSuccess: (campaign) => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      qc.invalidateQueries({ queryKey: ["campaign", campaign.id] });
      toast.success("Campaign cancelled");
    },
    onError: () => toast.error("Failed to cancel campaign"),
  });
}
