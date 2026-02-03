"use client";

import { useForm, Controller } from "react-hook-form"; // <--- Import Controller
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RiseLoader } from "react-spinners";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// --- NEW IMPORTS ---
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// -------------------
import Link from "next/link";
import { signupAction } from "@/app/actions/auth";
import { useState } from "react";
import { SignupInput, signupSchema } from "@/lib/validation";
import { republicBankBranches } from "./ui/staff-management";
import { republicBankDepartments } from "./ui/account-view";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control, // <--- Destructure control for the Select components
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
    formData.set("branch", data.branch);
    formData.set("department", data.department);

    const result = await signupAction(formData);
    
    setLoading(false); 

    if (result && !result.success) {
      if (result.fieldErrors) {
        setGlobalError("Please check the fields above.");
      } else {
        setGlobalError(result.message || "Something went wrong.");
      }
    }
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
          <Input {...register("name")} id="name" placeholder="John Doe" />
          {errors.name && (
            <FieldDescription className="text-red-500">{errors.name.message}</FieldDescription>
          )}
        </Field>

        {/* --- BRANCH SELECT --- */}
        <Field>
          <FieldLabel>Branch</FieldLabel>
          <Controller
            control={control}
            name="branch"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your branch" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]"> 
                  {republicBankBranches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.branch && (
            <FieldDescription className="text-red-500">{errors.branch.message}</FieldDescription>
          )}
        </Field>

        {/* --- DEPARTMENT SELECT --- */}
        <Field>
          <FieldLabel>Department</FieldLabel>
          <Controller
            control={control}
            name="department"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {republicBankDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.department && (
            <FieldDescription className="text-red-500">please select department</FieldDescription>
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
            <FieldDescription className="text-red-500">{errors.email.message}</FieldDescription>
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
            <FieldDescription className="text-red-500">{errors.password.message}</FieldDescription>
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
            <FieldDescription className="text-red-500">{errors.confirmPassword.message}</FieldDescription>
          )}
        </Field>

        <Field>
          <Button disabled={loading} type="submit" className="relative  w-full">
            {loading ? <RiseLoader size={6} color="white" /> : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" className="w-full">
            Sign up with GitHub
          </Button>
          <FieldDescription className="px-6 text-center mt-4">
            Already have an account? <Link href="/login" className="underline hover:text-primary">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}