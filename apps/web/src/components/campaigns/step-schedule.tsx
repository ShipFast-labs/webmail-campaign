import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLists } from "@/hooks/use-lists";
import { useTemplates } from "@/hooks/use-templates";
import type { WizardValues } from "@/hooks/use-campaign-wizard";

export function StepSchedule() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<WizardValues>();
  const values = watch();
  const { data: lists } = useLists();
  const { data: templates } = useTemplates();

  const summary: Record<string, string> = {
    Name: values.name,
    Subject: values.subject,
    From: `${values.fromName} <${values.fromEmail}>`,
    Audience: lists?.find((l) => l.id === values.targetListId)?.name ?? "—",
    Template: templates?.find((t) => t.id === values.templateId)?.name ?? "—",
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Schedule & Review</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose when to send, then confirm the details.
        </p>
      </div>

      <div className="p-1 bg-muted/50 rounded-lg inline-flex w-full sm:w-auto">
        <button
          type="button"
          onClick={() => {
            setValue("isScheduled", false);
            setValue("scheduledAt", null);
          }}
          className={cn(
            "flex-1 sm:flex-none px-5 py-2 text-sm font-medium rounded-md transition-all",
            !values.isScheduled
              ? "bg-card shadow text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Send Immediately
        </button>
        <button
          type="button"
          onClick={() => setValue("isScheduled", true)}
          className={cn(
            "flex-1 sm:flex-none px-5 py-2 text-sm font-medium rounded-md transition-all",
            values.isScheduled
              ? "bg-card shadow text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Schedule for Later
        </button>
      </div>

      {values.isScheduled && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 p-4 border rounded-lg"
        >
          <Label>Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !values.scheduledAt && "text-muted-foreground"
                )}
              >
                <HugeiconsIcon icon={Calendar01Icon} size={16} />
                {values.scheduledAt ? format(values.scheduledAt, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={values.scheduledAt ?? undefined}
                onSelect={(date) =>
                  setValue("scheduledAt", date ?? null, { shouldValidate: true })
                }
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
          {errors.scheduledAt && (
            <p className="text-xs text-destructive">{errors.scheduledAt.message}</p>
          )}
        </motion.div>
      )}

      <div className="p-4 border rounded-lg space-y-3">
        <h3 className="font-semibold text-sm border-b pb-2">Summary</h3>
        <div className="space-y-2 text-sm">
          {Object.entries(summary).map(([label, value]) => (
            <div key={label} className="grid grid-cols-[90px_1fr] gap-2">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium truncate">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
