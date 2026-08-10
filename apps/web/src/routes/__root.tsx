import { HeadContent, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";

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
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Outlet />
            <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
      {/* <TanStackRouterDevtools position="bottom-left" /> */}
    </>
  );
}
