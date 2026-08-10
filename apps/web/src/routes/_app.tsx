import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/topbar"


export const Route = createFileRoute("/_app")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated()) {
      throw redirect({ to: "/login" })
    }
  },
  component: AppShell,
})

function AppShell() {
  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 min-h-0 overflow-auto p-6 bg-app-shell-bg">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
