import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateContact, useUpdateContact } from "@/hooks/use-contacts";
import type { Contact } from "@/api/contacts";

const schema = z.object({
  email: z.string().email("Invalid email"),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  contact?: Contact | null;
}

export function ContactFormModal({ open, onClose, contact }: Props) {
  const isEdit = !!contact;
  const create = useCreateContact();
  const update = useUpdateContact();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) {
      reset({
        email: contact?.email ?? "",
        firstName: contact?.firstName ?? "",
        lastName: contact?.lastName ?? "",
        tags: contact?.tags?.join(", ") ?? "",
      });
    }
  }, [open, contact, reset]);

  const onSubmit = async (values: FormValues) => {
    const tags = values.tags
      ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : undefined;

    if (isEdit) {
      await update.mutateAsync({
        id: contact.id,
        payload: { firstName: values.firstName, lastName: values.lastName, tags },
      });
    } else {
      await create.mutateAsync({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        tags,
      });
    }
    onClose();
  };

  const isPending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Contact" : "New Contact"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register("email")} disabled={isEdit} placeholder="john@example.com" />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" {...register("firstName")} placeholder="John" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" {...register("lastName")} placeholder="Doe" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags <span className="text-muted-foreground text-xs">(comma separated)</span></Label>
            <Input id="tags" {...register("tags")} placeholder="vip, newsletter" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : isEdit ? "Save changes" : "Create contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
