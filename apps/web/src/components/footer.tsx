import { NamiSendLogo } from "./ui/namis-end-logo";

export function Footer() {
  return (
    <footer
      className="px-6 py-8"
      style={{
        backgroundColor: "var(--color-mm-cream-paper)",
        borderTop: "1.5px solid var(--color-mm-ink-black)",
      }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <NamiSendLogo showWordmark />
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            color: "var(--color-mm-stone-gray)",
          }}
        >
          © {new Date().getFullYear()} NamiSend
        </span>
      </div>
    </footer>
  );
}
