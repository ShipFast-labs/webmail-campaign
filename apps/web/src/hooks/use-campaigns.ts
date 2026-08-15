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
    queryKey: ["campaigns", id],
    queryFn: () => campaignsApi.getCampaign(id),
    enabled: !!id,
    refetchInterval: (query) =>
      query.state.data?.status === "SENDING" ? 5000 : false,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) => campaignsApi.createCampaign(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
    onError: () => toast.error("Failed to create campaign"),
  });
}

export function useScheduleCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, scheduledAt }: { id: string; scheduledAt: string }) =>
      campaignsApi.schedule(id, scheduledAt),
    onSuccess: (campaign) => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      qc.invalidateQueries({ queryKey: ["campaigns", campaign.id] });
      toast.success("Campaign scheduled");
    },
    onError: () => toast.error("Failed to schedule campaign"),
  });
}

export function useSendCampaignNow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignsApi.sendNow(id),
    onSuccess: (campaign) => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      qc.invalidateQueries({ queryKey: ["campaigns", campaign.id] });
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
      qc.invalidateQueries({ queryKey: ["campaigns", campaign.id] });
      toast.success("Campaign cancelled");
    },
    onError: () => toast.error("Failed to cancel campaign"),
  });
}

export function usePauseCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignsApi.pauseCampaign(id),
    onSuccess: (campaign) => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      qc.invalidateQueries({ queryKey: ["campaigns", campaign.id] });
      toast.success("Campaign paused");
    },
    onError: () => toast.error("Failed to pause campaign"),
  });
}

export function useResumeCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignsApi.resumeCampaign(id),
    onSuccess: (campaign) => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      qc.invalidateQueries({ queryKey: ["campaigns", campaign.id] });
      toast.success("Campaign resumed");
    },
    onError: () => toast.error("Failed to resume campaign"),
  });
}
