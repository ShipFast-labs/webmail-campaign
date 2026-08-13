// ── Spring Configurations ────────────────────────────────────────────────────

export const SPRING_CONFIGS = {
  /** Smooth, elegant entrance — minimal/no bounce */
  smooth: { damping: 14, mass: 1, stiffness: 45 },

  /** Snappy, responsive — quick settle */
  snappy: { damping: 16, stiffness: 130, mass: 0.8 },

  /** Bouncy, playful — noticeable oscillation */
  bouncy: { damping: 8, mass: 1, stiffness: 100 },

  /** Gentle, soft — slow and smooth */
  gentle: { damping: 20, stiffness: 60, mass: 1 },
} as const;

// ── Interpolation Mappings ───────────────────────────────────────────────────

export const INTERPOLATIONS = {
  /** Scale entrance — 80% → 100% */
  scaleEntrance: {
    input: [0, 1] as const,
    output: [0.8, 1] as const,
  },

  /** Fade — 0 → 1 */
  fade: {
    input: [0, 1] as const,
    output: [0, 1] as const,
  },

  /** Slide up — 20px → 0 */
  slideUp: {
    input: [0, 1] as const,
    output: [20, 0] as const,
  },

  /** Slide right — -50px → 0 */
  slideFromLeft: {
    input: [0, 1] as const,
    output: [-50, 0] as const,
  },

  /** Slide from right — 50px → 0 */
  slideFromRight: {
    input: [0, 1] as const,
    output: [50, 0] as const,
  },

  /** Overshoot scale — 0 → 1.15 */
  overshootScale: {
    input: [0, 1] as const,
    output: [0, 1.15] as const,
  },
} as const;

// ── Animation Timing ─────────────────────────────────────────────────────────

export const TIMING = {
  fps: 30,

  /** Total hero demo duration in frames (15 seconds) */
  heroDuration: 450,

  /** Scene boundaries — hard cuts every 150 frames */
  scenes: {
    dashboard: { start: 0, hold: 10, end: 150 },
    campaign: { start: 150, hold: 160, end: 300 },
    analytics: { start: 300, hold: 310, end: 450 },
  },

  /** Cross-fade transition duration between scenes */
  crossFade: 25,

  /** Stagger delays (in frames) */
  stagger: {
    kpiCards: 8,
    tableRows: 5,
    chartBars: 4,
    words: 4,
    items: 3,
  },

  /** Duration constants */
  durations: {
    fadeIn: 15,
    fadeOut: 10,
    hold: 30,
    quickTransition: 5,
    numberCount: 45,
    chartDraw: 50,
  },

  /** Feature micro-demo durations */
  features: {
    duration: 90, // 3 seconds at 30fps
    width: 320,
    height: 200,
  },

  /** CTA background loop */
  ctaLoop: {
    duration: 300, // 10 seconds at 30fps
  },
} as const;

// ── Easing Functions ─────────────────────────────────────────────────────────

export const EASING = {
  easeOut: (t: number) => t * (2 - t),
  easeIn: (t: number) => t * t,
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInCubic: (t: number) => t * t * t,
} as const;

// ── Frame Calculation Helpers ────────────────────────────────────────────────

/** Convert seconds to frames */
export const secondsToFrames = (seconds: number, fps: number = TIMING.fps) =>
  Math.round(seconds * fps);

/** Calculate stagger offset for a given index */
export const staggerFrame = (
  index: number,
  delay: number,
  startFrame: number = 0,
) => startFrame + index * delay;

/** Get normalised 0→1 progress within a frame range, clamped */
export const rangeProgress = (
  frame: number,
  start: number,
  end: number,
): number => Math.max(0, Math.min(1, (frame - start) / (end - start)));

/** Check if a given frame falls within a range */
export const isActive = (frame: number, start: number, end: number) =>
  frame >= start && frame <= end;

// ── Design Tokens (mirroring CSS vars for Remotion compositions) ─────────────

export const COLORS = {
  creamPaper: "#f5f1e4",
  inkBlack: "#2c2e2a",
  offWhite: "#f8f7f2",
  stoneGray: "#80827f",
  hairlineMist: "#d5d5d4",
  sandstone: "#e0dbce",

  // Accent
  freshGrass: "#8ed462",
  coralPop: "#ff705d",
  sunshinePop: "#f5e211",
  skyPop: "#2ba0ff",

  // Sticky notes / card fills
  stickyMint: "#d5f5c2",
  stickyTeal: "#a8e5e5",
  stickyBlush: "#f6d0ff",
  highlighterYellow: "#ffe95c",

  // Forest theme (from dashboard)
  forestInk: "#1a3300",
  pencilGray: "#b6b6b6",
  whisperGray: "#f1f1f1",
  terracotta: "#cb5521",
} as const;

export const FONTS = {
  display: "'Bricolage Grotesque', sans-serif",
  sans: "'Inter', sans-serif",
  mono: "'Roboto Mono', monospace",
} as const;

export const RADII = {
  small: 10,
  card: 12,
  pill: 50,
} as const;
