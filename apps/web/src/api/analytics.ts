import { api } from "@/lib/http-client";

interface ApiResponse<T> {
  data: T;
}

interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface PaginatedApiResponse<T> {
  data: T;
  pagination: Pagination;
}

export interface DashboardKpi {
  totalSent: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  sentTrend: number;
  openRateTrend: number;
  clickRateTrend: number;
  bounceRateTrend: number;
}

export interface TimeSeriesData {
  date: string;
  opens: number;
  clicks: number;
  sends: number;
}

export interface CampaignAnalytics {
  campaignId: string;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalUnsubscribed: number;
}

export interface CampaignRecipient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: "SENT" | "DELIVERED" | "OPENED" | "CLICKED" | "BOUNCED" | "UNSUBSCRIBED" | "FAILED";
  updatedAt: string;
}

export interface PaginatedRecipients {
  data: CampaignRecipient[];
  pagination: Pagination;
}

export const analyticsApi = {
  getDashboardKpi: () =>
    api.get<ApiResponse<DashboardKpi>>("/analytics/dashboard").then((r) => r.data.data),

  getDashboardTimeSeries: () =>
    api
      .get<ApiResponse<TimeSeriesData[]>>("/analytics/dashboard/timeseries")
      .then((r) => r.data.data),

  getCampaignAnalytics: (campaignId: string) =>
    api
      .get<ApiResponse<CampaignAnalytics>>(`/campaigns/${campaignId}/analytics`)
      .then((r) => r.data.data),

  getCampaignTimeSeries: (campaignId: string) =>
    api
      .get<ApiResponse<TimeSeriesData[]>>(`/campaigns/${campaignId}/analytics/timeseries`)
      .then((r) => r.data.data),

  getCampaignRecipients: (campaignId: string, page = 0, size = 20) =>
    api
      .get<PaginatedApiResponse<CampaignRecipient[]>>(`/campaigns/${campaignId}/contacts`, {
        params: { page, size },
      })
      .then((r) => r.data),
};
