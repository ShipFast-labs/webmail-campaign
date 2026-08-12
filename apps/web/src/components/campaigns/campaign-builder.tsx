import { FormProvider } from "react-hook-form";
import { useCampaignWizard } from "@/hooks/use-campaign-wizard";
import { WizardSidebar } from "./wizard-sidebar";
import { WizardFooter } from "./wizard-footer";
import { StepDetails } from "./step-details";
import { StepAudience } from "./step-audience";
import { StepTemplate } from "./step-template";
import { StepSchedule } from "./step-schedule";

const STEP_COMPONENTS = [StepDetails, StepAudience, StepTemplate, StepSchedule];

export function CampaignBuilder() {
  const { form, step, goNext, goBack, submit, isPending } = useCampaignWizard();
  const StepComponent = STEP_COMPONENTS[step - 1];
  const isScheduled = form.watch("isScheduled");

  return (
    <FormProvider {...form}>
      <div className="flex flex-col h-full">
        <div className="flex flex-1 min-h-0">
          <WizardSidebar currentStep={step} />
          <div className="flex-1 overflow-y-auto p-6">
            {StepComponent && <StepComponent />}
          </div>
        </div>
        <WizardFooter
          step={step}
          isScheduled={isScheduled}
          isPending={isPending}
          onBack={goBack}
          onNext={goNext}
          onSubmit={submit}
        />
      </div>
    </FormProvider>
  );
}
