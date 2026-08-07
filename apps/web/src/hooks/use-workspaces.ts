import { useQuery } from "@tanstack/react-query";
import { workspaceApi } from "@/api/workspace";

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: () => workspaceApi.listWorkspaces(),
  });
}
