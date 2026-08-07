import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactsApi } from "@/api/contacts";
import type { CreateContactPayload, UpdateContactPayload } from "@/api/contacts";
export type { ContactsResult } from "@/api/contacts";
import { toast } from "sonner";

export const contactKeys = {
  all: ["contacts"] as const,
  list: (params: object) => ["contacts", "list", params] as const,
  detail: (id: string) => ["contacts", id] as const,
  importProgress: (jobId: string) => ["contacts", "import", jobId] as const,
};

export function useContacts(params: {
  page: number;
  size?: number;
  status?: string;
  search?: string;
  tag?: string;
}) {
  return useQuery({
    queryKey: contactKeys.list(params),
    queryFn: () => contactsApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateContactPayload) => contactsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contactKeys.all });
      toast.success("Contact created");
    },
    onError: () => toast.error("Failed to create contact"),
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateContactPayload }) =>
      contactsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contactKeys.all });
      toast.success("Contact updated");
    },
    onError: () => toast.error("Failed to update contact"),
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contactKeys.all });
      toast.success("Contact deleted");
    },
    onError: () => toast.error("Failed to delete contact"),
  });
}

export function useImportContacts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => contactsApi.importCsv(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: contactKeys.all }),
    onError: () => toast.error("Failed to start import"),
  });
}

export function useImportProgress(jobId: string | null) {
  return useQuery({
    queryKey: contactKeys.importProgress(jobId ?? ""),
    queryFn: () => contactsApi.getImportProgress(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "COMPLETED" || status === "FAILED") return false;
      return 2000;
    },
  });
}
