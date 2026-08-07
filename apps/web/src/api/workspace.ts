import { api } from "@/lib/http-client";
import type { AuthWorkspace } from "@/store/auth-store";

interface BackendResponse<T> {
  data: T;
  pagination: unknown;
}

export const workspaceApi = {
  listWorkspaces: () =>
    api.get<BackendResponse<AuthWorkspace[]>>("/workspaces").then((r) => r.data.data),
};
