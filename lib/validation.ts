import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  // --- ADD THESE ---
  branch: z.string().min(1, "Branch is required"),
  department: z.string().min(1, "Department is required"),
  // -----------------
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type SignupInput = z.infer<typeof signupSchema>;


export const signinSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })

export type SigninInput = z.infer<typeof signinSchema>;
