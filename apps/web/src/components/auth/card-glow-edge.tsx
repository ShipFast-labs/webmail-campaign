// Decorative bottom-edge glow — coral light bleeding upward with scattered dust particles
// [left, bottom-px, size-px, opacity]
const DUST: [string, number, number, number][] = [
  ["2%",  2, 1,   0.30],
  ["5%",  5, 1.5, 0.50],
  ["8%",  3, 1,   0.40],
  ["11%", 7, 2,   0.55],
  ["14%", 2, 1,   0.35],
  ["17%", 5, 1.5, 0.45],
  ["20%", 8, 1,   0.30],
  ["23%", 3, 2,   0.65],
  ["26%", 6, 1,   0.40],
  ["29%", 2, 1.5, 0.50],
  ["32%", 9, 1,   0.35],
  ["35%", 4, 2,   0.60],
  ["38%", 2, 1,   0.45],
  ["41%", 6, 2.5, 0.75],
  ["44%", 3, 1,   0.50],
  ["47%", 8, 1.5, 0.65],
  ["50%", 2, 2.5, 0.85],
  ["53%", 5, 1,   0.55],
  ["56%", 3, 2,   0.70],
  ["59%", 7, 1.5, 0.45],
  ["62%", 2, 1,   0.35],
  ["65%", 5, 2,   0.60],
  ["68%", 8, 1,   0.40],
  ["71%", 3, 1.5, 0.55],
  ["74%", 6, 1,   0.35],
  ["77%", 2, 2,   0.65],
  ["80%", 7, 1,   0.30],
  ["83%", 4, 1.5, 0.50],
  ["86%", 2, 1,   0.40],
  ["89%", 6, 2,   0.55],
  ["92%", 3, 1,   0.35],
  ["95%", 5, 1.5, 0.45],
  ["98%", 2, 1,   0.30],
];

export function CardGlowEdge() {
  return (
    <div
      className="relative h-9 overflow-hidden pointer-events-none"
      style={{ marginTop: "calc(-1 * var(--card-spacing))" }}
    >
      {/* Radial bloom from bottom center */}
      <div
        className="absolute inset-x-0 bottom-0 h-full"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 100%, color-mix(in oklch, var(--primary) 28%, transparent) 0%, transparent 100%)",
        }}
      />

      <div
        className="absolute bottom-0 inset-x-0"
        style={{
          height: "1.5px",
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in oklch, var(--primary) 70%, transparent) 20%, var(--primary) 50%, color-mix(in oklch, var(--primary) 70%, transparent) 80%, transparent 100%)",
          filter: "blur(0.6px)",
        }}
      />

      {DUST.map(([left, bottom, size, opacity], i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left,
            bottom,
            width: size,
            height: size,
            background: "var(--primary)",
            opacity,
            filter: "blur(0.4px)",
          }}
        />
      ))}
    </div>
  );
}
