import { cn } from "@/lib/utils";

interface NamiSendLogoProps {
  size?: number;
  wordmarkSize?: number;
  showWordmark?: boolean;
  className?: string;
}

export function NamiSendLogo({
  size = 32,
  wordmarkSize,
  showWordmark = true,
  className,
}: NamiSendLogoProps) {
  const textSize = wordmarkSize ?? Math.max(Math.round(size * 0.56), 14);

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className="shrink-0"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="#1a3300" />
        <polyline
          points="8,25 8,7 24,25 24,7"
          fill="none"
          stroke="#ffe95c"
          strokeWidth="4.5"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      </svg>

      {showWordmark && (
        <span
          className="font-semibold leading-none text-foreground"
          style={{ fontFamily: "var(--font-sans)", fontSize: textSize }}
        >
          NamiSend
        </span>
      )}
    </span>
  );
}
