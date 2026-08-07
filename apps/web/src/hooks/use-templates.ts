import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { templateApi } from "@/api/templates";
import type { TemplatePreviewRequest } from "@/api/templates";
import { toast } from "sonner";

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () => templateApi.getTemplates().then(res => res.data),
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ["templates", id],
    queryFn: () => templateApi.getTemplate(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof templateApi.createTemplate>[0]) => templateApi.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template created successfully");
    },
    onError: () => toast.error("Failed to create template"),
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof templateApi.updateTemplate>[1] }) => templateApi.updateTemplate(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["templates", id] });
      toast.success("Template saved");
    },
    onError: () => toast.error("Failed to save template"),
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => templateApi.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template deleted");
    },
    onError: () => toast.error("Failed to delete template"),
  });
}

export function useDuplicateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => templateApi.duplicateTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template duplicated");
    },
    onError: () => toast.error("Failed to duplicate template"),
  });
}

export function usePreviewTemplate() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TemplatePreviewRequest }) => templateApi.previewTemplate(id, data),
  });
}
