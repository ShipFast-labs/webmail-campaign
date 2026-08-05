import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthLayout } from "@/components/auth/auth-layout";
import { FormField } from "@/components/auth/form-field";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/use-auth";
import { getApiError } from "@/lib/api-error";
import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

const schema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

function RegisterPage() {
  const navigate = useNavigate();
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function onSubmit({ confirmPassword: _omit, ...data }: FormValues) {
    registerUser(data, {
      onSuccess: () => navigate({ 
        to: "/dashboard",
        search: { workspace: useAuthStore.getState().workspace?.id } as any,
      }),
      onError: (err) => toast.error(getApiError(err)),
    });
  }

  return (
    <AuthLayout>
        <CardHeader className="pb-2">
          <span
            className="text-xl font-bold text-primary mb-3 block"
            style={{ fontFamily: "var(--font-wordmark)" }}
          >
            Campaign
          </span>
          <h1 className="text-xl font-semibold text-foreground">Create account</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Start your free trial today.</p>
        </CardHeader>

        <CardContent>
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.15 }} className="mb-4">
            <Button asChild variant="outline" className="w-full">
              <a href={`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/oauth2/authorization/google`}>
                Continue with Google
              </a>
            </Button>
          </motion.div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField id="fullName" label="Full name" error={errors.fullName?.message}>
              <Input
                id="fullName"
                placeholder="John Doe"
                autoComplete="name"
                aria-invalid={!!errors.fullName}
                {...register("fullName")}
              />
            </FormField>

            <FormField id="email" label="Work email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </FormField>

            <FormField id="password" label="Password" error={errors.password?.message}>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                placeholder="8 characters minimum"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
            </FormField>

            <FormField
              id="confirmPassword"
              label="Confirm password"
              error={errors.confirmPassword?.message}
            >
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                placeholder="Repeat your password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
            </FormField>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.15 }}
              className="pt-1"
            >
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating..." : "Create account"}
              </Button>
            </motion.div>
          </form>
        </CardContent>

        <CardFooter className="justify-center  border-border/50 pt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button asChild variant="link" className="p-0 h-auto font-medium text-sm">
              <Link to="/login">Sign in</Link>
            </Button>
          </p>
        </CardFooter>
    </AuthLayout>
  );
}
