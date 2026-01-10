"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signupAction } from "@/app/actions/auth";
import { useState } from "react";
import { SignupInput, signupSchema } from "@/lib/validation";
import { Mirage } from 'ldrs/react'
import 'ldrs/react/Mirage.css'

// Default values shown

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setLoading(true);
    setGlobalError(null);

    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("email", data.email);
    formData.set("password", data.password);
    formData.set("confirm-password", data.confirmPassword);

    const result = await signupAction(formData);

    setLoading(false);

    if (!result.success) {
      if (result.fieldErrors) {
        setGlobalError("Please fix the errors above.");
      } else {
        setGlobalError(result.message || "Something went wrong.");
      }
      return;
    }

    // Success: redirect happens inside signupAction
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the form below to create your account
          </p>
        </div>

        {globalError && (
          <p className="text-sm text-red-500 text-center">{globalError}</p>
        )}

        {/* Name */}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            {...register("name")}
            id="name"
            placeholder="John Doe"
          />
          {errors.name && (
            <FieldDescription className="text-red-500">
              {errors.name.message}
            </FieldDescription>
          )}
        </Field>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="example@email.com"
          />
          {errors.email && (
            <FieldDescription className="text-red-500">
              {errors.email.message}
            </FieldDescription>
          )}
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            {...register("password")}
            id="password"
            type="password"
            placeholder="At least 8 characters"
          />
          {errors.password && (
            <FieldDescription className="text-red-500">
              {errors.password.message}
            </FieldDescription>
          )}
        </Field>

        {/* Confirm Password */}
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            {...register("confirmPassword")}
            id="confirm-password"
            type="password"
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword && (
            <FieldDescription className="text-red-500">
              {errors.confirmPassword.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <Button disabled={loading} type="submit" className="relative">
            {!loading ?
             <RiseLoader
  speed="2.5"
  color="white" 
/> : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button">
            Sign up with GitHub
          </Button>

          <FieldDescription className="px-6 text-center">
            Already have an account? <Link href="/login">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
