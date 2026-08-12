import { useFormContext } from "react-hook-form";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick01Icon, UserMultiple02Icon } from "@hugeicons/core-free-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useLists } from "@/hooks/use-lists";
import type { WizardValues } from "@/hooks/use-campaign-wizard";

export function StepAudience() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<WizardValues>();
  const { data: lists, isLoading } = useLists();
  const selected = watch("targetListId");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Select Audience</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose which list will receive this campaign.
        </p>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))
        ) : !lists?.length ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No lists found. Create one first.
          </p>
        ) : (
          lists.map((list) => (
            <motion.button
              type="button"
              key={list.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => setValue("targetListId", list.id, { shouldValidate: true })}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-lg border text-left transition-colors",
                selected === list.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-3">
                <HugeiconsIcon
                  icon={UserMultiple02Icon}
                  size={16}
                  className="text-muted-foreground shrink-0"
                />
                <div>
                  <p className="font-medium text-sm">{list.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {list.contactCount.toLocaleString()} contacts
                  </p>
                </div>
              </div>
              {selected === list.id && (
                <HugeiconsIcon icon={Tick01Icon} size={18} className="text-primary shrink-0" />
              )}
            </motion.button>
          ))
        )}
        {errors.targetListId && (
          <p className="text-xs text-destructive">{errors.targetListId.message}</p>
        )}
      </div>
    </div>
  );
}
