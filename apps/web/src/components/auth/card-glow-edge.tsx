// Decorative bottom edge — yellow ink wash inspired by the Highlighter Yellow signature
export function CardGlowEdge() {
  return (
    <div className="relative h-7 overflow-hidden pointer-events-none" aria-hidden>
      {/* Soft yellow bloom from bottom center */}
      <div
        className="absolute inset-x-0 bottom-0 h-full"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(255,233,92,0.22) 0%, transparent 100%)",
        }}
      />
      {/* Crisp yellow hairline at very bottom */}
      <div
        className="absolute bottom-0 inset-x-0"
        style={{
          height: "1.5px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,233,92,0.5) 20%, rgba(255,233,92,0.85) 50%, rgba(255,233,92,0.5) 80%, transparent 100%)",
        }}
      />
    </div>
  );
}
