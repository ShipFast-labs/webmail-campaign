import { api } from "@/lib/http-client";

export interface Template {
  id: string;
  workspaceId: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplatePayload {
  name: string;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
}

export interface UpdateTemplatePayload {
  name?: string;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
}

export interface TemplatePreviewRequest {
  htmlContent: string;
  variables: Record<string, string>;
}

export interface TemplatePreviewResponse {
  htmlContent: string;
}

interface BackendResponse<T> {
  data: T;
  pagination: unknown;
}

export const templateApi = {
  getTemplates: () =>
    api.get<BackendResponse<Template[]>>("/templates").then((r) => r.data.data),

  getTemplate: (id: string) =>
    api.get<BackendResponse<Template>>(`/templates/${id}`).then((r) => r.data.data),

  createTemplate: (data: CreateTemplatePayload) =>
    api.post<BackendResponse<Template>>("/templates", data).then((r) => r.data.data),

  updateTemplate: (id: string, data: UpdateTemplatePayload) =>
    api.put<BackendResponse<Template>>(`/templates/${id}`, data).then((r) => r.data.data),

  deleteTemplate: (id: string) =>
    api.delete(`/templates/${id}`),

  duplicateTemplate: (id: string) =>
    api.post<BackendResponse<Template>>(`/templates/${id}/duplicate`).then((r) => r.data.data),

  previewTemplate: (id: string, request: TemplatePreviewRequest) =>
    api.post<BackendResponse<TemplatePreviewResponse>>(`/templates/${id}/preview`, request).then((r) => r.data.data),
};
