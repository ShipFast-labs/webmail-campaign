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
import { NamiSendLogo } from "@/components/ui/namis-end-logo";

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

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

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

  function onSubmit(values: FormValues) {
    const { confirmPassword: _pw, ...data } = values;
    void _pw;
    registerUser(data, {
      onSuccess: () => navigate({ to: "/dashboard" }),
      onError: (err) => toast.error(getApiError(err)),
    });
  }

  return (
    <AuthLayout>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-3">
          <NamiSendLogo />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Create account</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Start your free trial today.</p>
      </CardHeader>

      <CardContent>
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.15 }} className="mb-4">
          <Button asChild variant="outline" className="w-full gap-2">
            <a href={`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/oauth2/authorization/google`}>
              <GoogleLogo />
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

          <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Repeat your password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </FormField>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.15 }} className="pt-1">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating..." : "Create account"}
            </Button>
          </motion.div>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-border/50 pt-4">
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
