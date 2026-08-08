import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/api/analytics";

export function useDashboardKpi() {
  return useQuery({
    queryKey: ["analytics", "dashboard", "kpi"],
    queryFn: () => analyticsApi.getDashboardKpi(),
  });
}

export function useDashboardTimeSeries() {
  return useQuery({
    queryKey: ["analytics", "dashboard", "timeseries"],
    queryFn: () => analyticsApi.getDashboardTimeSeries(),
  });
}

export function useCampaignAnalytics(campaignId: string) {
  return useQuery({
    queryKey: ["analytics", "campaign", campaignId, "overview"],
    queryFn: () => analyticsApi.getCampaignAnalytics(campaignId),
    enabled: !!campaignId,
  });
}

export function useCampaignTimeSeries(campaignId: string) {
  return useQuery({
    queryKey: ["analytics", "campaign", campaignId, "timeseries"],
    queryFn: () => analyticsApi.getCampaignTimeSeries(campaignId),
    enabled: !!campaignId,
  });
}

export function useCampaignRecipients(campaignId: string, page = 0, size = 20) {
  return useQuery({
    queryKey: ["analytics", "campaign", campaignId, "recipients", page, size],
    queryFn: () => analyticsApi.getCampaignRecipients(campaignId, page, size),
    enabled: !!campaignId,
  });
}
