import { api } from "@/lib/http-client";

export interface Contact {
  id: string;
  workspaceId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: "ACTIVE" | "UNSUBSCRIBED" | "BOUNCED" | "CLEANED";
  customFields: Record<string, unknown> | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactsResult {
  contacts: Contact[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface CreateContactPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
}

export interface UpdateContactPayload {
  firstName?: string;
  lastName?: string;
  tags?: string[];
}

export interface ImportJobResponse {
  importJobId: string;
}

export interface ImportProgress {
  jobId: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
  errorDetails: string | null;
}

export const contactsApi = {
  list: async (params: {
    page?: number;
    size?: number;
    status?: string;
    search?: string;
    tag?: string;
  }): Promise<ContactsResult> => {
    const r = await api.get<{
      data: Contact[];
      pagination: { page: number; size: number; totalElements: number; totalPages: number };
    }>("/contacts", { params: { size: 20, ...params } });
    return { contacts: r.data.data, pagination: r.data.pagination };
  },

  get: (id: string) =>
    api.get<{ data: Contact }>(`/contacts/${id}`).then((r) => r.data.data),

  create: (payload: CreateContactPayload) =>
    api.post<{ data: Contact }>("/contacts", payload).then((r) => r.data.data),

  update: (id: string, payload: UpdateContactPayload) =>
    api.put<{ data: Contact }>(`/contacts/${id}`, payload).then((r) => r.data.data),

  delete: (id: string) => api.delete(`/contacts/${id}`),

  importCsv: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api
      .post<{ data: ImportJobResponse }>("/contacts/import", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data.data);
  },

  getImportProgress: (jobId: string) =>
    api
      .get<{ data: ImportProgress }>(`/contacts/import/${jobId}`)
      .then((r) => r.data.data),
};
