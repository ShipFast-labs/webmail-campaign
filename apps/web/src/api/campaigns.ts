import { api } from "@/lib/http-client";

export type CampaignStatus = "DRAFT" | "SCHEDULED" | "SENDING" | "PAUSED" | "COMPLETED" | "CANCELLED";

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
  scheduledAt?: string | null;
}

interface BackendResponse<T> {
  data: T;
  pagination: unknown;
}

export const campaignsApi = {
  listCampaigns: () =>
    api.get<BackendResponse<Campaign[]>>("/campaigns").then((r) => r.data.data),

  getCampaign: (id: string) =>
    api.get<BackendResponse<Campaign>>(`/campaigns/${id}`).then((r) => r.data.data),

  createCampaign: (payload: CreateCampaignPayload) =>
    api.post<BackendResponse<Campaign>>("/campaigns", payload).then((r) => r.data.data),

  sendNow: (id: string) =>
    api.post<BackendResponse<Campaign>>(`/campaigns/${id}/send`).then((r) => r.data.data),

  cancelCampaign: (id: string) =>
    api.post<BackendResponse<Campaign>>(`/campaigns/${id}/cancel`).then((r) => r.data.data),
};
