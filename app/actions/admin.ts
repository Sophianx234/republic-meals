"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user";
import { auth } from "@/lib/auth"; // Better Auth
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// --- FETCH STAFF ---
export async function getStaffList(query: string = "") {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.role !== "admin") return { success: false, users: [] };

    await connectToDatabase();

    const regex = new RegExp(query, "i");

    const users = await User.find({
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
        { department: { $regex: regex } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(100) // Safety limit
    .lean();

    return {
      success: true,
      users: users.map((u: any) => ({
        ...u,
        _id: u._id.toString(),
        createdAt: u.createdAt.toISOString()
      }))
    };
  } catch (error) {
    return { success: false, users: [] };
  }
}

// --- UPDATE ROLE / DEPT ---
export async function updateStaffMember(userId: string, data: { role: string; department: string; branch: string }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.role !== "admin") return { success: false, error: "Unauthorized" };

    await connectToDatabase();

    await User.findByIdAndUpdate(userId, {
      role: data.role,
      department: data.department,
      branch: data.branch
    });

    revalidatePath("/admin/staff");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Update failed" };
  }
}

// --- TOGGLE BAN/ACTIVE ---
export async function toggleUserStatus(userId: string, isBanned: boolean) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.role !== "admin") return { success: false, error: "Unauthorized" };

    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { banned: isBanned });
    
    revalidatePath("/admin/staff");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Action failed" };
  }
}