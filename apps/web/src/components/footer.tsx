

const APP_NAME = "Campaign";

export function Footer() {
  return (
    <footer
      className="px-6 py-8"
      style={{ borderTop: "1px solid var(--color-pencil-gray)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/50">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-extrabold"
              style={{
                backgroundColor: "var(--color-highlighter-yellow)",
                color: "var(--color-forest-ink)",
                fontFamily: "var(--font-display)",
              }}
            >
              C
            </span>
            <span className="font-semibold text-foreground">{APP_NAME}</span>
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
  );
}
