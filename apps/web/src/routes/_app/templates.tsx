import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/templates")({
  component: TemplatesPage,
})

function TemplatesPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-1">Templates</h1>
      <p className="text-sm text-muted-foreground">Monaco editor with live Freemarker preview — Day 4.</p>
    </div>
  )
}
