import { api } from "@/lib/http-client";
import type { AuthWorkspace } from "@/store/auth-store";
import type { ApiResponse } from "@/api/auth";

export const workspaceApi = {
  listWorkspaces: () =>
    api.get<ApiResponse<AuthWorkspace[]>>("/workspaces").then((r) => r.data.data),
};
