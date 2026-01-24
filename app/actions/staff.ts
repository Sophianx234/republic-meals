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
  note: string,
  dateStr?: string
) {
  try {
    await connectToDatabase();
    
    // Default to today if no date provided
    const orderDate = dateStr ? new Date(dateStr) : new Date();
    
    // --- CUTOFF LOGIC (8:30 AM) ---
    const now = new Date();
    
    // check if ordering for today
    const isToday = new Date(orderDate).setHours(0,0,0,0) === new Date().setHours(0,0,0,0);
    
    if (isToday) {
        const cutoff = new Date();
        cutoff.setHours(8, 30, 0, 0); // 8:30 AM
        if (now > cutoff) {
            return { success: false, error: "Orders for today closed at 8:30 AM." };
        }
    }

    // Check for existing order
    const startOfDay = new Date(orderDate); startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(orderDate); endOfDay.setHours(23,59,59,999);

    const existing = await Order.findOne({
        user: userId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $nin: ["cancelled", "rejected"] }
    });

    if (existing) return { success: false, error: "Active order already exists for this date." };

    // Fetch Foods
    const foodIds = items.map(i => i.foodId);
    const foods = await Food.find({ _id: { $in: foodIds } });

    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const foodDetails = foods.find(f => f._id.toString() === item.foodId);
      if (!foodDetails) return null;

      totalAmount += (foodDetails.price || 0) * item.quantity;

      return {
        food: foodDetails._id, // <--- CRITICAL FIX: Save the Reference!
        name: foodDetails.name,
        price: foodDetails.price || 0,
        quantity: item.quantity,
      };
    }).filter(Boolean);

    await Order.create({
      user: userId,
      date: orderDate,
      items: orderItems,
      totalAmount,
      status: "confirmed",
      note,
      pickupCode: `RB-${Math.random().toString(36).substring(2, 5).toUpperCase()}`
    });

    revalidatePath("/schedule");
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




export async function getMonthlySchedule(year: number, month: number, userId: string) {
  try {
    await connectToDatabase();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    // Fetch Menus
    const menus = await Menu.find({
      date: { $gte: startDate, $lte: endDate }
    })
    .populate({ path: "items.food", model: Food, select: "name category images price" })
    .lean();

    // Fetch Orders
    const orders = await Order.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
      status: { $nin: ["cancelled"] }
    })
    .populate({ 
        path: "items.food", // This works because we fixed submitComboOrder
        model: Food, 
        select: "images" 
    }) 
    .lean();

    // Map Menus
    const scheduleMap: Record<string, any[]> = {};
    menus.forEach((menu: any) => {
      const dateKey = menu.date.toISOString().split("T")[0];
      scheduleMap[dateKey] = (menu.items || [])
        .filter((i: any) => i.food)
        .map((i: any) => ({
          id: i.food._id.toString(),
          name: i.food.name,
          category: i.food.category,
          price: i.food.price || 0,
          image: i.food.images?.[0] || null,
          isSoldOut: i.isSoldOut
        }));
    });

    // Map Orders (Sanitized)
    const orderMap: Record<string, any> = {};
    orders.forEach((order: any) => {
        const dateKey = order.date.toISOString().split("T")[0];
        orderMap[dateKey] = {
            id: order._id.toString(),
            items: order.items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                // Safely access the populated image
                image: item.food?.images?.[0] || null 
            })),
            totalAmount: order.totalAmount,
            status: order.status,
            note: order.note
        };
    });

    return { success: true, data: scheduleMap, userOrders: orderMap };

  } catch (e) {
    console.error("Schedule Error:", e);
    return { success: false, data: {}, userOrders: {} };
  }
}

// Ensure cancelScheduledOrder is present as provided previously
export async function cancelScheduledOrder(orderId: string, userId: string) {
    try {
        await connectToDatabase();
        const order = await Order.findOne({ _id: orderId, user: userId });
        
        if (!order) return { success: false, error: "Order not found" };

        // Calculate Cutoff: 8:30 AM on the Order Date
        const orderDate = new Date(order.date);
        const cutoffTime = new Date(orderDate);
        cutoffTime.setHours(8, 30, 0, 0);

        const now = new Date();

        // Allow cancellation if NOW is before the Cutoff
        if (now > cutoffTime) {
            return { success: false, error: "Cancellation period ended at 8:30 AM." };
        }

        order.status = "cancelled";
        await order.save();
        
        revalidatePath("/schedule");
        return { success: true };
    } catch (e) {
        return { success: false, error: "Failed to cancel" };
    }
}

