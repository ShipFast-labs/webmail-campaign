import { api } from "@/lib/http-client";

export interface AudienceList {
  id: string;
  workspaceId: string;
  name: string;
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListContact {
  contactId: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  addedAt: string;
}

interface BackendResponse<T> {
  data: T;
  pagination: unknown;
}

export const listApi = {
  getLists: () =>
    api.get<BackendResponse<AudienceList[]>>("/lists").then((r) => r.data.data),

  getList: (id: string) =>
    api.get<BackendResponse<AudienceList>>(`/lists/${id}`).then((r) => r.data.data),

  createList: (name: string) =>
    api.post<BackendResponse<AudienceList>>("/lists", { name }).then((r) => r.data.data),

  updateList: (id: string, name: string) =>
    api.put<BackendResponse<AudienceList>>(`/lists/${id}`, { name }).then((r) => r.data.data),

  deleteList: (id: string) =>
    api.delete(`/lists/${id}`),

  getListContacts: (listId: string) =>
    api.get<BackendResponse<ListContact[]>>(`/lists/${listId}/contacts`).then((r) => r.data.data),

  addContactsToList: (listId: string, contactIds: string[]) =>
    api.post(`/lists/${listId}/contacts`, { contactIds }),

  removeContactFromList: (listId: string, contactId: string) =>
    api.delete(`/lists/${listId}/contacts/${contactId}`),
};
