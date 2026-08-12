import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Calendar01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { WIZARD_STEPS } from "@/hooks/use-campaign-wizard";

interface Props {
  step: number;
  isScheduled: boolean;
  isPending: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function WizardFooter({ step, isScheduled, isPending, onBack, onNext, onSubmit }: Props) {
  const isLast = step === WIZARD_STEPS.length;

  return (
    <div className="p-4 md:p-6 border-t bg-card shrink-0 flex items-center justify-between">
      <Button variant="outline" onClick={onBack} disabled={step === 1}>
        Back
      </Button>

      {isLast ? (
        <Button onClick={() => onSubmit()} disabled={isPending}>
          {isPending ? (
            "Processing..."
          ) : isScheduled ? (
            <>
              <HugeiconsIcon icon={Calendar01Icon} size={16} />
              Schedule Campaign
            </>
          ) : (
            <>
              <HugeiconsIcon icon={Mail01Icon} size={16} />
              Send Now
            </>
          )}
        </Button>
      ) : (
        <Button onClick={onNext}>
          Next
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Button>
      )}
    </div>
  );
}
