import { api } from "@/lib/http-client";

export interface RegisterRequest {
  workspaceName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: {
    userId: string;
    email: string;
    role: "ADMIN" | "MARKETER";
  };
  workspace: {
    workspaceId: string;
    name: string;
    slug: string;
    plan: string;
  };
}

export const authApi = {
  register: (body: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", body).then((r) => r.data),

  login: (body: LoginRequest) => api.post<AuthResponse>("/auth/login", body).then((r) => r.data),

  refresh: (refreshToken: string) =>
    api.post<AuthTokens>("/auth/refresh", { refreshToken }).then((r) => r.data),

  logout: (refreshToken: string) => api.post("/auth/logout", { refreshToken }),

  me: () => api.get<AuthResponse["user"]>("/auth/me").then((r) => r.data),
};
