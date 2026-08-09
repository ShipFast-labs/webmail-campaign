import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiMail02Icon, SentIcon } from "@hugeicons/core-free-icons";

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
  const iconSize = Math.round(size * 0.55);
  const textSize = wordmarkSize ?? Math.max(Math.round(size * 0.56), 14);

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="shrink-0 inline-flex items-center justify-center bg-primary/90 rounded-[var(--radius)]"
        style={{ width: size, height: size }}
      >
        <HugeiconsIcon icon={AiMail02Icon} size={iconSize} color="white" strokeWidth={1.8} />
      </span>

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
