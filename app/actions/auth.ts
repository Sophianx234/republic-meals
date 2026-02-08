'use server'

import { auth } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { signinSchema, signupSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await auth.api.signInEmail({
      body: { email, password },
    });

    // If we get here, sign in was successful
    const role = response.user.role;
    const destination = role === 'staff' 
      ? '/staff/launch-menu/meal' 
      : role === 'admin' 
        ? '/admin' 
        : '/restaurant/dashboard';

    // We don't redirect here yet because we are inside a try block
    return { success: true, redirectTo: destination };

  } catch (error: any) {
    // Return the error to the client instead of throwing
    return { 
      success: false, 
      message: error.message || "Invalid email or password" 
    };
  }
}
export async function signupAction(formData: FormData) {
  const rawData = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirm-password") ?? ""),
    // --- EXTRACT NEW FIELDS ---
    branch: String(formData.get("branch") ?? ""),
    department: String(formData.get("department") ?? ""),
    // --------------------------
  };

  const parseResult = signupSchema.safeParse(rawData);

  if (!parseResult.success) {
    return {
      success: false,
      message: "Validation failed",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  const data = parseResult.data;

  try {
    const response = await auth.api.signUpEmail({
      body: { 
        email: data.email, 
        password: data.password, 
        name: data.name,
        // --- PASS TO AUTH ---
        // Ensure your Better Auth config allows these fields, 
        // or that your Mongoose schema is set up to capture them.
        branch: data.branch,
        department: data.department
        // --------------------
      },
    });

    if (!response) {
      return { success: false, message: "Sign up failed" };
    }

    // Success redirect
    redirect(`/onboard/${response.user.id}?username=${encodeURIComponent(data.name)}`);

  } catch (error) {
    // If the redirect throws (Next.js behavior), rethrow it
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { success: false, message: "An error occurred during sign up" };
  }
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
    return {
      success: true
    }
    
    

  } catch (error) {
    console.error("Profile update failed:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    // Better Auth handles token generation and internal state
    // Change this line
const result = await auth.api.requestPasswordReset({
      body: {
        email: email.toLowerCase(),
        redirectTo: "/reset-password", 
      },
      headers: await headers(),
    });
    return { success: true };
  } catch (error: any) {
    // Professional Tip: Don't reveal if an email exists or not 
    // to prevent user enumeration. Always return success or a generic error.
    console.error("Forgot Password Error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}


export async function resetPasswordAction(values: { 
  password: string; 
  token: string | null 
}) {
  const { password, token } = values;

  if (!token) {
    return { error: "Reset token is missing." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  try {
    // Calling the Better Auth Server API to finalize the reset
    const response = await auth.api.resetPassword({
      body: {
        newPassword: password,
        token: token
      },
      headers: await headers()
    });

    if(!response) {
      return { error: "Failed to reset password. Please try again." };
    }
    return { success: true };
  } catch (error: any) {
    console.error("Reset Password Error:", error);
    return { 
      error: error.message || "Failed to reset password. The link may have expired." 
    };
  }
}