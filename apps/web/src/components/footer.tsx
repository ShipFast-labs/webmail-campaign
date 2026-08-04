import { Link } from "@tanstack/react-router"

const APP_NAME = "Campaign" // TODO: replace with product name

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <span
            className="font-semibold text-foreground"
            style={{ fontFamily: "var(--font-wordmark)" }}
          >
            {APP_NAME}
          </span>
          <span className="hidden sm:block" aria-hidden>·</span>
          <span className="hidden sm:block">Send campaigns that matter.</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="/privacy"
            className="hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Terms
          </a>
          <span aria-label={`Copyright ${new Date().getFullYear()}`}>
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  )
}
