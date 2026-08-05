import { authApi, type LoginRequest, type RegisterRequest } from "@/api/auth";
import { workspaceApi } from "@/api/workspace";
import { useAuthStore } from "@/store/auth-store";
import { queryClient } from "@/lib/query-client";

export const authService = {
  async login(request: LoginRequest) {
    const data = await authApi.login(request);
    
    useAuthStore.getState().setAuth({
      user: data.user,
      workspace: data.activeWorkspace,
      accessToken: data.tokens.accessToken,
      refreshToken: data.tokens.refreshToken,
    });
    
    queryClient.clear();
    return data;
  },

  async register(request: RegisterRequest) {
    const data = await authApi.register(request);
    
    useAuthStore.getState().setAuth({
      user: data.user,
      workspace: data.activeWorkspace,
      accessToken: data.tokens.accessToken,
      refreshToken: data.tokens.refreshToken,
    });
    
    queryClient.clear();
    return data;
  },

  async handleOAuthLogin(accessToken: string, refreshToken: string) {
    const { setAuth, clearAuth } = useAuthStore.getState();
    
    // Set temporary tokens for api client interceptors
    setAuth({
      accessToken,
      refreshToken,
      user: null as any,
      workspace: null as any,
    });

    try {
      const [user, workspaces] = await Promise.all([
        authApi.me(),
        workspaceApi.listWorkspaces(),
      ]);

      if (!workspaces || workspaces.length === 0) {
        throw new Error("No workspaces found for this account.");
      }

      setAuth({
        accessToken,
        refreshToken,
        user,
        workspace: workspaces[0],
      });

      queryClient.clear();
      return { user, workspace: workspaces[0] };
    } catch (err) {
      clearAuth();
      throw err;
    }
  },

  logout() {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (refreshToken) {
      // Fire and forget the logout API call to invalidate tokens on backend
      authApi.logout(refreshToken).catch(() => {});
    }

    useAuthStore.getState().clearAuth();
    queryClient.clear();
  }
};
