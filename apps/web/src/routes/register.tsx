import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/register")({
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <div className="min-h-svh flex items-center justify-center">
      <p className="text-muted-foreground">Register page — coming Day 2.</p>
    </div>
  )
}
