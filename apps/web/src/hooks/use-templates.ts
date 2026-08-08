import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { templateApi } from "@/api/templates";
import type { CreateTemplatePayload, UpdateTemplatePayload, TemplatePreviewRequest } from "@/api/templates";
import { toast } from "sonner";

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () => templateApi.getTemplates(),
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ["templates", id],
    queryFn: () => templateApi.getTemplate(id),
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTemplatePayload) => templateApi.createTemplate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template created");
    },
    onError: () => toast.error("Failed to create template"),
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTemplatePayload }) =>
      templateApi.updateTemplate(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["templates"] });
      qc.invalidateQueries({ queryKey: ["templates", id] });
      toast.success("Template saved");
    },
    onError: () => toast.error("Failed to save template"),
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => templateApi.deleteTemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template deleted");
    },
    onError: () => toast.error("Failed to delete template"),
  });
}

export function useDuplicateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => templateApi.duplicateTemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template duplicated");
    },
    onError: () => toast.error("Failed to duplicate template"),
  });
}

export function usePreviewTemplate() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TemplatePreviewRequest }) =>
      templateApi.previewTemplate(id, data),
  });
}
