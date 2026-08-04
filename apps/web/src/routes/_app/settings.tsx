import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground">Workspace and account settings.</p>
    </div>
  )
}
