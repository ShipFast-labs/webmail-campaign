import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useCreateCampaign, useScheduleCampaign, useSendCampaignNow } from "./use-campaigns";

export const wizardSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  subject: z.string().min(1, "Subject is required"),
  fromName: z.string().min(1, "From name is required"),
  fromEmail: z.string().email("Invalid email address"),
  targetListId: z.string().min(1, "Please select an audience list"),
  templateId: z.string().min(1, "Please select a template"),
  isScheduled: z.boolean(),
  scheduledAt: z.date().nullable(),
});

export type WizardValues = z.infer<typeof wizardSchema>;

export const WIZARD_STEPS = [
  { id: 1, title: "Details" },
  { id: 2, title: "Audience" },
  { id: 3, title: "Template" },
  { id: 4, title: "Schedule" },
] as const;

const STEP_FIELDS: Record<number, (keyof WizardValues)[]> = {
  1: ["name", "subject", "fromName", "fromEmail"],
  2: ["targetListId"],
  3: ["templateId"],
  4: [],
};

export function useCampaignWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const createCampaign = useCreateCampaign();
  const scheduleCampaign = useScheduleCampaign();
  const sendNow = useSendCampaignNow();

  const form = useForm<WizardValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      name: "",
      subject: "",
      fromName: "",
      fromEmail: "",
      targetListId: "",
      templateId: "",
      isScheduled: false,
      scheduledAt: null,
    },
    mode: "onChange",
  });

  const isPending =
    createCampaign.isPending || scheduleCampaign.isPending || sendNow.isPending;

  const goNext = async () => {
    const fields = STEP_FIELDS[step] ?? [];
    if (fields.length > 0) {
      const valid = await form.trigger(fields);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const submit = form.handleSubmit(async (data) => {
    if (data.isScheduled && !data.scheduledAt) {
      form.setError("scheduledAt", { message: "Please select a date" });
      return;
    }

    const campaign = await createCampaign.mutateAsync({
      name: data.name,
      subject: data.subject,
      fromName: data.fromName,
      fromEmail: data.fromEmail,
      targetListId: data.targetListId,
      templateId: data.templateId,
    });

    if (data.isScheduled && data.scheduledAt) {
      await scheduleCampaign.mutateAsync({
        id: campaign.id,
        scheduledAt: data.scheduledAt.toISOString(),
      });
    } else {
      await sendNow.mutateAsync(campaign.id);
    }

    navigate({ to: "/campaigns" });
  });

  return { form, step, goNext, goBack, submit, isPending };
}
