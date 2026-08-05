import { useMutation } from "@tanstack/react-query";

import { authService } from "@/lib/auth-service";

export function useLogin() {
  return useMutation({
    mutationFn: (req: Parameters<typeof authService.login>[0]) => authService.login(req),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (req: Parameters<typeof authService.register>[0]) => authService.register(req),
  });
}
