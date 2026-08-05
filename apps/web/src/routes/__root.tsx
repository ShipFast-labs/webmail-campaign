import { HeadContent, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactLenis } from "lenis/react";

import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/query-client";

import "../index.css";

import type { AuthUser, AuthWorkspace } from "@/store/auth-store";

export interface RouterAppContext {
  queryClient: typeof queryClient;
  auth: {
    user: AuthUser | null;
    workspace: AuthWorkspace | null;
    isAuthenticated: () => boolean;
  };
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      { title: "Campaign — Email campaigns that deliver" },
      {
        name: "description",
        content: "Build, send, and track email campaigns to your contact lists.",
      },
    ],
    links: [{ rel: "icon", href: "/favicon.ico" }],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <ReactLenis root options={{ lerp: 0.1, duration: 1.4 }}>
            <Outlet />
            <Toaster richColors />
          </ReactLenis>
        </ThemeProvider>
      </QueryClientProvider>
      {/* <TanStackRouterDevtools position="bottom-left" /> */}
    </>
  );
}
