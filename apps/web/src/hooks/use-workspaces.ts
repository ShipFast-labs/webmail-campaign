import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "@/api/workspace";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: () => workspaceApi.listWorkspaces(),
  });
}

export function useCreateWorkspace() {
  const qc = useQueryClient();
  const setWorkspace = useAuthStore((state) => state.setWorkspace);
  
  return useMutation({
    mutationFn: (name: string) => workspaceApi.createWorkspace(name),
    onSuccess: (workspace) => {
      qc.invalidateQueries({ queryKey: ["workspaces"] });
      setWorkspace(workspace);
      toast.success("Workspace created successfully");
    },
    onError: () => toast.error("Failed to create workspace"),
  });
}
