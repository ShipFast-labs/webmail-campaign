import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/lists")({
  component: ListsPage,
})

function ListsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-1">Lists</h1>
      <p className="text-sm text-muted-foreground">Audience lists and contact membership — Day 4.</p>
    </div>
  )
}
