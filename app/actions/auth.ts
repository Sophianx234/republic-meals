'use server'

import { auth } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { signinSchema, signupSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
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


export async function updateUserProfile(formData: FormData) {
  // 1. Get current user session
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const file = formData.get("file") as File | null
  const color = formData.get("color") as string | null
  
  try {
    let updateData = {}

    // SCENARIO A: User uploaded an Image
    if (file && file.size > 0) {
      const imageUrl = await uploadToCloudinary(file,`profile`)
      
      updateData = {
        image: imageUrl,
        profileColor: null // Clear color if image exists
      }
    } 
    // SCENARIO B: User picked a Color
    else if (color) {
      updateData = {
        image: null, // Clear image if color is picked
        profileColor: color
      }
    } else {
        return { success: false, message: "No input provided" }
    }

    // 2. Update User via Better Auth
    await auth.api.updateUser({
      headers: await headers(),
      body: updateData
    })

    // 3. Revalidate to update UI immediately
    redirect("/dashboard") 
    

  } catch (error) {
    console.error("Profile update failed:", error)
    return { success: false, error: "Failed to update profile" }
  }
}