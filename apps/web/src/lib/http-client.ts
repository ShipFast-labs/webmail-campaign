import axios from "axios";

import { useAuthStore } from "@/store/auth-store";
import { queryClient } from "@/lib/query-client";

export const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Day 2: replace clearAuth with transparent refresh before giving up
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      queryClient.clear();
    }
    return Promise.reject(error);
  },
);
