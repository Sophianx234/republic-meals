"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { Settings } from "@/models/settings";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { settingsSchema, SettingsValues } from "../(main)/admin/settings/page";

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
export async function updateSystemSettings(data: SettingsValues) {
  try {
    // 1. Authenticate & Authorize
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized access." };
    }

    // 2. Validate Data with Zod
    const result = settingsSchema.safeParse(data);

    if (!result.success) {
      // Return the first error message found
      const errorMessage = result.error.issues[0].message;
      return { success: false, error: errorMessage };
    }

    const validData = result.data;

    // 3. Connect DB
    await connectToDatabase();

    // 4. Update the Single Document
    // We add 'lastUpdatedBy' for the audit trail we discussed
    const updatePayload = {
      ...validData,
      lastUpdatedBy: session.user.name || session.user.email,
    };

    await Settings.findOneAndUpdate(
      {}, // Empty filter matches the first/only document
      updatePayload, 
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 5. Revalidate Paths
    revalidatePath("/admin/settings"); // Update the form
    revalidatePath("/"); // Update the Global Banner instantly

    return { success: true };

  } catch (error) {
    console.error("Settings Update Error:", error);
    return { success: false, error: "Failed to update settings. Please try again." };
  }
}