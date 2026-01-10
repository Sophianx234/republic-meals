'use server'

import { auth } from "@/lib/auth";
import { signinSchema, signupSchema } from "@/lib/validation";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export async function signInAction(formData: FormData) {
  const rawData = {

    email: formData.get("email") ,
    password: formData.get("password") ,
  }
  
  const data = signinSchema.parse(rawData);
  const response = await auth.api.signInEmail({
    body: {email:data.email,password:data.password },
  })

  if(!response) {
    return {
      success: false,
      message: "Sign in failed",

    }
  }
  
  redirect("/dashboard");
}
export async function signupAction(formData: FormData) {
  const rawData = {
  name: String(formData.get("name") ?? ""),
  email: String(formData.get("email") ?? ""),
  password: String(formData.get("password") ?? ""),
  confirmPassword: String(formData.get("confirm-password") ?? ""),
};


  const data = signupSchema.parse(rawData);
  const response = await auth.api.signUpEmail({
    body: { email: data.email, password: data.password, name: data.name },
  })

  if(!response) {
    return {
      success: false,
      message: "Sign up failed",
    }
  }

  redirect("/dashboard");
}

export async function signOutAction() {
const response = await auth.api.signOut({
  headers: await headers(),
});

if(!response) {
  return {
    success: false,
    message: "Sign out failed",
  }
}
redirect("/login");
}