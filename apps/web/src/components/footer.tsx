import { NamiSendLogo } from "./ui/namis-end-logo";


export function Footer() {
  return (
    <footer
      className="px-6 py-12"
      style={{ 
        backgroundColor: "var(--color-mm-cream-paper)",
        borderTop: "1.5px solid var(--color-mm-ink-black)" 
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <NamiSendLogo />
          <span 
            style={{ 
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "var(--color-mm-stone-gray)" 
            }}
          >
            Send campaigns that matter.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="/privacy"
            className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ 
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "var(--color-mm-ink-black)",
              borderBottom: "1px solid var(--color-mm-stone-gray)"
            }}
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ 
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "var(--color-mm-ink-black)",
              borderBottom: "1px solid var(--color-mm-stone-gray)"
            }}
          >
            Terms
          </a>
          <span 
            aria-label={`Copyright ${new Date().getFullYear()}`}
            style={{ 
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "var(--color-mm-stone-gray)" 
            }}
          >
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
