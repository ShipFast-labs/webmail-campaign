import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/contacts")({
  component: ContactsPage,
})

function ContactsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-1">Contacts</h1>
      <p className="text-sm text-muted-foreground">Contact table, filters, and CSV import — Day 3.</p>
    </div>
  )
}
