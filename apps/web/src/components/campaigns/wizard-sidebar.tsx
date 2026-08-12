import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS } from "@/hooks/use-campaign-wizard";

interface Props {
  currentStep: number;
}

export function WizardSidebar({ currentStep }: Props) {
  return (
    <div className="w-48 border-r bg-muted/20 p-6 hidden sm:flex flex-col shrink-0">
      <div className="space-y-5">
        {WIZARD_STEPS.map((s) => {
          const isActive = currentStep === s.id;
          const isDone = currentStep > s.id;

          return (
            <div key={s.id} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0 transition-colors",
                  isActive && "bg-primary text-primary-foreground",
                  isDone && "bg-primary/20 text-foreground",
                  !isActive && !isDone && "bg-muted text-muted-foreground"
                )}
              >
                {isDone ? <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} /> : s.id}
              </div>
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive && "text-foreground",
                  isDone && "text-foreground/70",
                  !isActive && !isDone && "text-muted-foreground"
                )}
              >
                {s.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
