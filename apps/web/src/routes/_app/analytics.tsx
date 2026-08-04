import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/analytics")({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-1">Analytics</h1>
      <p className="text-sm text-muted-foreground">Funnel chart and time-series events — Day 8.</p>
    </div>
  )
}
