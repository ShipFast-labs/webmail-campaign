import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/api/auth";
import { useAuthStore } from "@/store/auth-store";

function applyAuthResponse(data: Awaited<ReturnType<typeof authApi.login>>) {
  useAuthStore.getState().setAuth({
    user: data.user,
    workspace: data.workspace,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: applyAuthResponse,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: applyAuthResponse,
  });
}
