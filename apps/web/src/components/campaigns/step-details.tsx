import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WizardValues } from "@/hooks/use-campaign-wizard";

export function StepDetails() {
  const {
    register,
    formState: { errors },
  } = useFormContext<WizardValues>();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Campaign Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Name your campaign and set the sender info.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Campaign Name</Label>
          <Input id="name" placeholder="e.g. Summer Sale 2026" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="subject">Subject Line</Label>
          <Input
            id="subject"
            placeholder="e.g. Don't miss these deals!"
            {...register("subject")}
          />
          {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="fromName">From Name</Label>
            <Input id="fromName" placeholder="e.g. Acme Corp" {...register("fromName")} />
            {errors.fromName && (
              <p className="text-xs text-destructive">{errors.fromName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fromEmail">From Email</Label>
            <Input
              id="fromEmail"
              placeholder="hello@acmecorp.com"
              {...register("fromEmail")}
            />
            {errors.fromEmail && (
              <p className="text-xs text-destructive">{errors.fromEmail.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
