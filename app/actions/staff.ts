'use server'
import { connectToDatabase } from "@/lib/mongodb";
import { Food } from "@/models/food";
import { Menu } from "@/models/menu";
import { Order } from "@/models/order";
import { endOfDay, startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";

export async function getTodaysMenu() {
  try {
    await connectToDatabase();
    
    // 1. Create the date range for "Today"
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);

    console.log("🔍 Querying Menu for:", start.toISOString(), "to", end.toISOString());

    // 2. Find menu
    const menu = await Menu.findOne({
      date: { $gte: start, $lte: end }
    }).populate({
      path: "items.food",
      model: Food, // <--- CRITICAL: Explicitly pass the model to prevent populate errors
      select: "name category price images description", 
    }).lean();

    if (!menu) {
      console.log("❌ No menu found for today.");
      return null;
    }

    console.log("✅ Menu found with ID:", menu._id);

    // 3. Transform for UI
    // We map carefully to avoid crashes if a food item was deleted
    const items = (menu.items || []).map((item: any) => {
      if (!item.food) return null; // Skip if food relation is broken

      return {
        id: item.food._id.toString(),
        name: item.food.name,
        category: item.food.category || "Main",
        price: item.food.price || 0,
        images: item.food.images || [], // Ensure array exists
        isSoldOut: item.isSoldOut,
      };
    }).filter((item: any) => item !== null);

    return {
      id: menu._id.toString(),
      cutoffTime: "24:30", 
      items: items,
    };

  } catch (error) {
    console.error("🔥 Error in getTodaysMenu:", error); // <--- Log the actual error
    return null;
  }
}

// --- 2. GET USER'S EXISTING ORDER ---
export async function getMyDailyOrder(userId: string) {
  try {
    await connectToDatabase();
    const today = new Date();

    // FIXED: Removed .populate() because your OrderSchema stores 
    // items as a snapshot (name, price, quantity), not as references to Food.
    const order = await Order.findOne({
      user: userId,
      date: { $gte: startOfDay(today), $lte: endOfDay(today) }
    }).lean();

    if (!order) return null;

    return {
      id: order._id.toString(),
      status: order.status, 
      totalAmount: order.totalAmount,
      note: order.note, // Added note so you can see it in the UI
      items: order.items.map((i: any) => ({
        name: i.name,      // Direct access from Order document
        quantity: i.quantity,
        price: i.price
      }))
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}
// --- 3. SUBMIT ORDER ---
export async function submitOrder(userId: string, foodId: string) {
  try {
    await connectToDatabase();
    
    // 1. Double check if menu exists and isn't sold out
    // ... (Validation logic here) ...

    // 2. Create Order
    await Order.create({
      user: userId,
      items: [{  foodId }], // Simplify price fetching in real app
      totalAmount: 123,
      date: new Date(),
      status: "pending"
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to place order" };
  }
}

export async function submitComboOrder(
  userId: string, 
  items: { foodId: string; quantity: number }[], 
  note: string
) {
  try {
    await connectToDatabase();
    
    // --- CONFIGURATION ---
    const CUTOFF_HOUR = 24;   // e.g., 10 AM
    const CUTOFF_MINUTE = 30; // e.g., 30 Minutes
    // ---------------------

    const now = new Date();
    
    // 1. CHECK CUTOFF TIME
    // Create a date object for the Cutoff Time TODAY
    const cutoffTime = new Date(now);
    cutoffTime.setHours(CUTOFF_HOUR, CUTOFF_MINUTE, 0, 0);

    // If right now is past the cutoff time, block the order
    if (now > cutoffTime) {
      return { 
        success: false, 
        error: `Orders are closed for the day. Cutoff time was ${CUTOFF_HOUR}:${CUTOFF_MINUTE}.` 
      };
    }

    // 2. CHECK FOR EXISTING ORDER TODAY
    // Set time to midnight (00:00:00) to check the whole day
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const existingOrder = await Order.findOne({ 
      user: userId,
      date: { $gte: startOfToday } 
    });

    if (existingOrder) {
      return { success: false, error: "You have already placed an order today." };
    }

    // 3. PROCEED WITH ORDER (Standard Logic)
    const foodIds = items.map(i => i.foodId);
    const foods = await Food.find({ _id: { $in: foodIds } });

    if (!foods.length) return { success: false, error: "Items not found" };

    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const foodDetails = foods.find(f => f._id.toString() === item.foodId);
      if (!foodDetails) return null;

      const itemTotal = (foodDetails.price || 0) * item.quantity;
      totalAmount += itemTotal;

      return {
        name: foodDetails.name,
        price: foodDetails.price || 0,
        quantity: item.quantity,
      };
    }).filter(Boolean);

    await Order.create({
      user: userId,
      date: now,
      items: orderItems,
      totalAmount: totalAmount,
      status: "pending",
      note: note 
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to place order" };
  }
}


export async function cancelOrder(orderId: string, userId: string) {
  try {
    // await connectToDatabase();
    
    // Find and delete the order. 
    // Security Check: Ensure the order belongs to the requesting user.
    // Logic Check: Only allow cancelling if status is 'pending'
    const result = await Order.findOneAndDelete({ 
      _id: orderId, 
      user: userId,
      status: "pending" 
    });

    if (!result) {
      return { success: false, error: "Order not found or cannot be cancelled (already processing)." };
    }

    revalidatePath("/dashboard"); // or your menu path
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to cancel order" };
  }
}