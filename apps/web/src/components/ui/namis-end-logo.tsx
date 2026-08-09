import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { SentIcon } from "@hugeicons/core-free-icons";

interface NamiSendLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export function NamiSendLogo({ size = 32, showWordmark = true, className }: NamiSendLogoProps) {
  const iconSize = Math.round(size * 0.55);

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="shrink-0 inline-flex items-center justify-center bg-primary rounded-[var(--radius)]"
        style={{ width: size, height: size }}
      >
        <HugeiconsIcon icon={SentIcon} size={iconSize} color="white" strokeWidth={1.8} />
      </span>

      {showWordmark && (
        <span
          className="font-semibold leading-none text-foreground"
          style={{ fontFamily: "var(--font-sans)", fontSize: size * 0.44 }}
        >
          NamiSend
        </span>
      )}
    </span>
  );
}
