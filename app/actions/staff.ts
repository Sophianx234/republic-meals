"use server";

import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/order";
import { User } from "@/models/user";
import { revalidatePath } from "next/cache";
import z from "zod";
// import { Food } from "@/models/food"; // Not strictly needed if not populating, but good practice


const UpdateProfileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(2, "Name is too short"),
  phone: z.string().optional().or(z.literal("")), // Allow empty string
  department: z.string().optional().or(z.literal("")),
  floor: z.string().optional().or(z.literal("")),
  defaultNote: z.string().max(200, "Note is too long").optional().or(z.literal("")),
});

export async function getStaffOrderHistory(userId: string) {
  try {
    await connectToDatabase();

    // 1. Fetch Raw Orders
    const rawOrders = await Order.find({
      user: userId,
      status: { $nin: ["cancelled", "rejected"] }
    })
    .sort({ date: -1 })
    .lean();

    // 2. Calculate Aggregates
    let totalSpent = 0;
    const totalOrders = rawOrders.length;
    
    // Stats Containers
    const monthlyFrequency: Record<string, number> = {};
    const categoryStats: Record<string, number> = {};

    const formattedOrders = rawOrders.map((order: any) => {
      totalSpent += (order.totalAmount || 0);

      // Group by Month for Frequency Chart
      const monthKey = new Date(order.date).toLocaleDateString("en-US", { month: "short" }); // e.g. "Jan"
      monthlyFrequency[monthKey] = (monthlyFrequency[monthKey] || 0) + 1;

      // Flatten items for CSV & Count Categories
      const itemNames: string[] = [];
      
      (order.items || []).forEach((item: any) => {
         itemNames.push(`${item.quantity}x ${item.name}`);
         
         // Infer category if not saved, or just count occurrences
         // Ideally, you'd save category on the order item, but we can just count "Meals" vs "Drinks" logic if available
         // For now, let's just track Order Consistency
      });

      return {
        id: order._id.toString(),
        date: order.date.toISOString(),
        items: (order.items || []).map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        })),
        summary: itemNames.join(", "),
        totalAmount: order.totalAmount || 0,
        status: order.status,
        pickupCode: order.pickupCode
      };
    });

    // 3. Format Frequency Chart Data
    const chartData = Object.entries(monthlyFrequency).map(([name, count]) => ({
      name,
      total: count // This is now Count, not Money
    })).reverse(); // Oldest to newest usually better for trends

    // Calculate Average
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    return {
      success: true,
      stats: {
        totalSpent,
        totalOrders,
        averageOrderValue
      },
      chartData, 
      orders: formattedOrders
    };

  } catch (error) {
    console.error("History fetch error:", error);
    return { success: false, error: "Failed to load history" };
  }
}


export async function updateAccountSettings(formData: FormData) {
  try {
    await connectToDatabase();

    const userId = formData.get("userId") as string;
    const file = formData.get("image") as File | null;

    // 1. Handle Image Upload (if a new file was selected)
    let imageUrl;
    if (file && file.size > 0 && file.type.startsWith("image/")) {
      imageUrl = await uploadToCloudinary(file, "profile");
    }

    // 2. Validate Text Data
    const rawData = {
      userId,
      name: formData.get("name"),
      phone: formData.get("phone"),
      department: formData.get("department"),
      floor: formData.get("floor"),
      defaultNote: formData.get("defaultNote"),
    };

    const validated = UpdateProfileSchema.safeParse(rawData);
    
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    // 3. Prepare Update Object
    const updateData: any = {
      name: validated.data.name,
      department: validated.data.department,
      floor: validated.data.floor,
      phone: validated.data.phone,
      defaultNote: validated.data.defaultNote,
    };

    // Only update image if a new one was uploaded
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    // 4. Update Database
    await User.findByIdAndUpdate(userId, { $set: updateData });

    revalidatePath("/account");
    return { success: true, imageUrl }; // Return new image URL to update client state immediately if needed

  } catch (error) {
    console.error("Profile Update Error:", error);
    return { success: false, error: "Failed to update profile." };
  }
}