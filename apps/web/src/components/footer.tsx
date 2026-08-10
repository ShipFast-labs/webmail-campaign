import { NamiSendLogo } from "./ui/namis-end-logo";


const APP_NAME = "Campaign";

export function Footer() {
  return (
    <footer
      className="px-6 py-8"
      style={{ borderTop: "1px solid var(--color-pencil-gray)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/50">
        <div className="flex items-center gap-3">
          <NamiSendLogo />
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
