import { api } from "@/lib/http-client";

export interface RegisterRequest {
  fullName: string;
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

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
  activeWorkspace: {
    id: string;
    name: string;
    ownerId: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  tokens: AuthTokens;
}

export const authApi = {
  register: (body: RegisterRequest) =>
    api.post<ApiResponse<AuthResponse>>("/auth/register", body).then((r) => r.data.data),

  login: (body: LoginRequest) => 
    api.post<ApiResponse<AuthResponse>>("/auth/login", body).then((r) => r.data.data),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<AuthTokens>>("/auth/refresh", { refreshToken }).then((r) => r.data.data),

  logout: (refreshToken: string) => api.post("/auth/logout", { refreshToken }),

  me: () => api.get<ApiResponse<AuthResponse["user"]>>("/auth/me").then((r) => r.data.data),
};
