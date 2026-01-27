"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { Settings } from "@/models/settings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Fetch Settings (Publicly readable, but usually restricted)
export async function getSystemSettings() {
  try {
    await connectToDatabase();
    // Get the first document, or create default if none exists
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }
    
    return { 
      success: true, 
      settings: JSON.parse(JSON.stringify(settings)) 
    };
  } catch (error) {
    return { success: false, settings: null };
  }
}

// Update Settings (Admin Only)
export async function updateSystemSettings(data: any) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.role !== "admin") return { success: false, error: "Unauthorized" };

    await connectToDatabase();
    
    // Update the singleton document
    await Settings.findOneAndUpdate({}, data, { upsert: true, new: true });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Update failed" };
  }
}