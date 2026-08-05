import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/campaigns")({
  component: CampaignsPage,
})

function CampaignsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-1">Campaigns</h1>
      <p className="text-sm text-muted-foreground">Campaign list, wizard, and analytics — Day 5.</p>
    </div>
  )
}
