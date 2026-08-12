import { useFormContext } from "react-hook-form";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick01Icon } from "@hugeicons/core-free-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTemplates } from "@/hooks/use-templates";
import type { WizardValues } from "@/hooks/use-campaign-wizard";

export function StepTemplate() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<WizardValues>();
  const { data: templates, isLoading } = useTemplates();
  const selected = watch("templateId");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Select Template</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose the email design for this campaign.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))
        ) : !templates?.length ? (
          <p className="text-sm text-muted-foreground col-span-2 py-8 text-center">
            No templates found. Create one first.
          </p>
        ) : (
          templates.map((tpl) => (
            <motion.button
              type="button"
              key={tpl.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setValue("templateId", tpl.id, { shouldValidate: true })}
              className={cn(
                "flex flex-col p-4 rounded-lg border text-left transition-colors",
                selected === tpl.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/40"
              )}
            >
              <p className="font-medium text-sm">{tpl.name}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{tpl.subject}</p>
              {selected === tpl.id && (
                <div className="mt-2 flex items-center gap-1 text-xs font-medium text-primary">
                  <HugeiconsIcon icon={Tick01Icon} size={12} />
                  Selected
                </div>
              )}
            </motion.button>
          ))
        )}
      </div>
      {errors.templateId && (
        <p className="text-xs text-destructive mt-1">{errors.templateId.message}</p>
      )}
    </div>
  );
}
