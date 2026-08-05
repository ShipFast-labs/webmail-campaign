import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth-store";
import { getApiError } from "@/lib/api-error";
import { authService } from "@/lib/auth-service";

const searchParamsSchema = z.object({
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  error: z.string().optional(),
});

export const Route = createFileRoute("/oauth2/redirect")({
  validateSearch: searchParamsSchema,
  component: OAuth2RedirectPage,
});

function OAuth2RedirectPage() {
  const { accessToken, refreshToken, error } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    async function processLogin() {
      if (error) {
        toast.error(`OAuth login failed: ${error}`);
        navigate({ to: "/login", replace: true });
        return;
      }

      if (!accessToken || !refreshToken) {
        toast.error("Missing authentication tokens");
        navigate({ to: "/login", replace: true });
        return;
      }

      try {
        const { workspace } = await authService.handleOAuthLogin(accessToken, refreshToken);
        toast.success("Successfully logged in with Google");
        navigate({ 
          to: "/dashboard", 
          search: { workspace: workspace.id } as any,
          replace: true 
        });
      } catch (err) {
        toast.error(getApiError(err));
        useAuthStore.getState().clearAuth();
        navigate({ to: "/login", replace: true });
      }
    }

    processLogin();
  }, [accessToken, refreshToken, error, navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <p className="text-muted-foreground animate-pulse text-lg font-medium">
          Completing login...
        </p>
      </div>
    </div>
  );
}
