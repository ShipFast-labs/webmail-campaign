type Props = { children: React.ReactNode };

export function AuthFooter({ children }: Props) {
  return (
    <div className="relative overflow-hidden border-t border-border/50">
      {/* Cross grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, var(--pattern-line) 49%, var(--pattern-line) 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, var(--pattern-line) 49%, var(--pattern-line) 51%, transparent 51%)
          `,
          backgroundSize: "18px 18px",
        }}
      />
      {/* Slight dark tint over the pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "oklch(from var(--background) calc(l - 0.04) c h / 0.7)" }}
      />

      <div className="relative z-10 flex items-center justify-center py-4 px-5">
        {children}
      </div>
    </div>
  );
}
