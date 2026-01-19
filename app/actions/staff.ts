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

    const order = await Order.findOne({
      user: userId,
      date: { $gte: startOfDay(today), $lte: endOfDay(today) }
    }).populate("items.food", "name price description images").lean();

    if (!order) return null;

    return {
      id: order._id.toString(),
      status: order.status, // "pending", "ready", "collected"
      totalAmount: order.totalAmount,
      items: order.items.map((i: any) => ({
        name: i.food.name,
        quantity: i.quantity,
        price: i.price
      }))
    };
  } catch (error) {
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
    
    // 1. Fetch details for ALL selected foods to get current prices/names
    const foodIds = items.map(i => i.foodId);
    const foods = await Food.find({ _id: { $in: foodIds } });

    if (!foods.length) return { success: false, error: "Items not found" };

    // 2. Build the order items array with snapshot data
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

    // 3. Create Order
    await Order.create({
      user: userId,
      date: new Date(),
      items: orderItems,
      totalAmount: totalAmount,
      status: "pending",
      note: note // Save the special instruction (e.g., "1/2 Rice, 1/2 Beans")
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to place order" };
  }
}