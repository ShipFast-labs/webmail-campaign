import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/login")({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-svh flex items-center justify-center">
      <p className="text-muted-foreground">Login page — coming Day 2.</p>
    </div>
  )
}
