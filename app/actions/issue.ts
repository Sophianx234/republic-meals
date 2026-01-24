"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { Issue } from "@/models/issue";
import { auth } from "@/lib/auth"; // Better Auth
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const IssueSchema = z.object({
  type: z.enum(["Technical", "Food Quality", "Delivery", "Other"]),
  priority: z.enum(["Low", "Medium", "High"]),
  subject: z.string().min(5, "Subject is too short"),
  description: z.string().min(10, "Please provide more detail"),
});

export async function submitIssue(formData: FormData) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return { success: false, error: "Unauthorized" };

    await connectToDatabase();

    const rawData = {
      type: formData.get("type"),
      priority: formData.get("priority"),
      subject: formData.get("subject"),
      description: formData.get("description"),
    };

    const validated = IssueSchema.safeParse(rawData);

    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    await Issue.create({
      user: session.user.id,
      ...validated.data,
      status: "Open"
    });

    // You might want to revalidate an admin dashboard here
    // revalidatePath("/admin/issues"); 
    
    return { success: true };

  } catch (error) {
    console.error("Issue Submission Error:", error);
    return { success: false, error: "Failed to submit issue." };
  }
}