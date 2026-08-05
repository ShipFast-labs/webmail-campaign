import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthWorkspace {
  id: string;
  name: string;
  ownerId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: AuthUser | null;
  workspace: AuthWorkspace | null;
  accessToken: string | null;
  refreshToken: string | null;

  setAuth: (payload: {
    user: AuthUser;
    workspace: AuthWorkspace;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      workspace: null,
      accessToken: null,
      refreshToken: null,

      setAuth: ({ user, workspace, accessToken, refreshToken }) =>
        set({ user, workspace, accessToken, refreshToken }),

      setAccessToken: (accessToken) => set({ accessToken }),

      clearAuth: () =>
        set({ user: null, workspace: null, accessToken: null, refreshToken: null }),

      isAuthenticated: () => !!get().accessToken && !!get().user,
    }),
    {
      name: "auth",
      // Only persist tokens + IDs, not derived UI state
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        workspace: state.workspace,
      }),
    },
  ),
);
