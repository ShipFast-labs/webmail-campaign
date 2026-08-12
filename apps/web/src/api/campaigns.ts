import { api } from "@/lib/http-client";

export type CampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "SENDING"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED";

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  status: CampaignStatus;
  templateId: string | null;
  targetListId: string | null;
  scheduledAt: string | null;
  createdAt: string;
}

export interface CreateCampaignPayload {
  name: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  templateId: string;
  targetListId: string;
}

interface ApiResponse<T> {
  data: T;
}

export const campaignsApi = {
  listCampaigns: () =>
    api.get<ApiResponse<Campaign[]>>("/campaigns").then((r) => r.data.data),

  getCampaign: (id: string) =>
    api.get<ApiResponse<Campaign>>(`/campaigns/${id}`).then((r) => r.data.data),

  createCampaign: (payload: CreateCampaignPayload) =>
    api.post<ApiResponse<Campaign>>("/campaigns", payload).then((r) => r.data.data),

  sendNow: (id: string) =>
    api.post<ApiResponse<Campaign>>(`/campaigns/${id}/send-now`).then((r) => r.data.data),

  schedule: (id: string, scheduledAt: string) =>
    api
      .post<ApiResponse<Campaign>>(`/campaigns/${id}/schedule`, { scheduledAt })
      .then((r) => r.data.data),

  cancelCampaign: (id: string) =>
    api.post<ApiResponse<Campaign>>(`/campaigns/${id}/cancel`).then((r) => r.data.data),

  pauseCampaign: (id: string) =>
    api.post<ApiResponse<Campaign>>(`/campaigns/${id}/pause`).then((r) => r.data.data),

  resumeCampaign: (id: string) =>
    api.post<ApiResponse<Campaign>>(`/campaigns/${id}/resume`).then((r) => r.data.data),
};
