import axios from "axios";

import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/lib/auth-service";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? "http://localhost:8085"}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const { accessToken, workspace } = useAuthStore.getState();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  if (workspace?.id) config.headers["X-Workspace-Id"] = workspace.id;
  return config;
});

let isRefreshing = false;
let queue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function flushQueue(token: string | null, err?: unknown) {
  queue.forEach((p) => (token ? p.resolve(token) : p.reject(err)));
  queue = [];
}

function logout() {
  authService.logout();
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry || original.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    const { refreshToken, setAccessToken } = useAuthStore.getState();

    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    // Another request is already refreshing — queue this one
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      // Dynamic import breaks the circular dep at init time
      const { authApi } = await import("@/api/auth");
      const { accessToken } = await authApi.refresh(refreshToken);
      setAccessToken(accessToken);
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      flushQueue(accessToken);
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch (refreshError) {
      flushQueue(null, refreshError);
      logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
