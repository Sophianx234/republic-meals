"use server"

import { auth } from "@/lib/auth"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { connectToDatabase } from "@/lib/mongodb"
import { Food } from "@/models/food"
import { Menu } from "@/models/menu"
import { Order } from "@/models/order"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { z } from "zod"

// Zod Schema for validation
const MealSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  category: z.enum(["Main", "Side", "Drink", "Snack"]),
  description: z.string().optional(),
})

const MenuFormSchema = z.object({
  date: z.coerce.date(),
  meals: z.array(MealSchema).min(1, "Add at least one meal"),
})

const FoodSchema = z.object({
  name: z.string().min(2),
  category: z.enum(["Main", "Side", "Drink", "Snack"]),
  description: z.string().optional(),
  image: z.string().optional()
})
export async function createDailyMenu(data: z.infer<typeof MenuFormSchema>) {
  // 1. Auth Check (Security)
  

  try {
    await connectToDatabase()
    
    // 2. Validate Data
    const validated = MenuFormSchema.parse(data)
    
    // 3. Normalize Date (Strip time to ensure uniqueness per day)
    const menuDate = new Date(validated.date)
    menuDate.setHours(0, 0, 0, 0)

    // 4. Check for existing menu (Upsert logic)
    // We search by date. If found, we update it. If not, create new.
    await Menu.findOneAndUpdate(
      { date: menuDate },
      { 
        $set: { 
          meals: validated.meals,
          isPublished: true // Publish immediately for now
        } 
      },
      { upsert: true, new: true }
    )

    revalidatePath("/dashboard") // Update staff dashboard
    revalidatePath("/restaurant") // Update restaurant dashboard

    return { success: true }

  } catch (error) {
    console.error("Menu creation failed:", error)
    if (error instanceof z.ZodError) {
        return { success: false, error: error?.errors[0].message }
    }
    return { success: false, error: "Failed to save menu." }
  }
}




export async function getFoodLibrary() {
  await connectToDatabase()
  // Return plain objects for Client Components
  const foods = await Food.find({ isArchived: false }).sort({ name: 1 }).lean()
  return JSON.parse(JSON.stringify(foods))
}




type DailySchedule = {
  date: Date
  foodIds: string[]
}

export async function publishWeeklySchedule(schedule: DailySchedule[]) {
  try {
    await connectToDatabase()

    // Process each day in the schedule
    for (const day of schedule) {
      if (day.foodIds.length === 0) continue; // Skip empty days

      // 1. Get the actual food details to snapshot the price
      const foods = await Food.find({ _id: { $in: day.foodIds } })
      
      const menuItems = foods.map(f => ({
        food: f._id,
        isSoldOut: false
      }))

      // 2. Upsert the Menu for that Date
      // We strip time to ensure it matches the exact day
      const dateKey = new Date(day.date)
      dateKey.setHours(0,0,0,0)

      await Menu.findOneAndUpdate(
        { date: dateKey },
        { $set: { items: menuItems } },
        { upsert: true, new: true }
      )
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (e) {
    console.error(e)
    return { success: false }
  }
}


export async function addFoodItem(formData: FormData) {
  // 2. Auth Check (Security)
 

  await connectToDatabase()

  // 3. Extract Data
  // Use .getAll() to retrieve all files from the dropzone
  const files = formData.getAll("images") as File[]
  
  const rawData = {
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description"),
  }

  // 4. Validate Text Fields
  const validation = FoodSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message }
  }

  try {
    const imageUrls: string[] = []

    // 5. Handle Multiple Image Uploads
    if (files && files.length > 0) {
      // Use Promise.all to upload images in parallel (faster)
      const uploadPromises = files.map(async (file) => {
        // Simple validation to ensure it's a real file
        if (file.size > 0 && file.type.startsWith("image/")) {
           return await uploadToCloudinary(file, "food-catalog")
        }
        return null
      })
      
      const results = await Promise.all(uploadPromises)
      
      // Filter out any failed or null uploads
      results.forEach(url => { 
        if(url) imageUrls.push(url) 
      })
    }

    // 6. Create Database Entry
    await Food.create({
      ...validation.data, // name, category, description
      images: imageUrls,  // Save the array of URLs
      isArchived: false
    })
    
    revalidatePath("/restaurant/menu")
    return { success: true }

  } catch (error) {
    console.error("Food upload error:", error)
    return { success: false, error: "Failed to save item to database" }
  }
}


export async function deleteFoodItem(id: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || (session.user.role !== "restaurant" && session.user.role !== "admin")) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await connectToDatabase()
    await Food.findByIdAndDelete(id)
    revalidatePath("/restaurant/menu")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete item" }
  }
}



// 2. UPDATE ACTION
const EditSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  category: z.enum(["Main", "Side", "Drink", "Snack"]),
  description: z.string().optional(),
})

export async function updateFoodItem(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || (session.user.role !== "restaurant" && session.user.role !== "admin")) {
    return { success: false, error: "Unauthorized" }
  }

  await connectToDatabase()

  // Extract
  const files = formData.getAll("new_images") as File[] // New uploads
  const existingImages = formData.getAll("existing_images") as string[] // URLs kept by user
  
  const rawData = {
    id: formData.get("id"),
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description"),
  }

  const validation = EditSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: "Invalid data" }
  }

  try {
    const newImageUrls: string[] = []

    // Upload NEW files
    if (files && files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        if (file.size > 0 && file.type.startsWith("image/")) {
           return await uploadToCloudinary(file, "food-catalog")
        }
        return null
      })
      const results = await Promise.all(uploadPromises)
      results.forEach(url => { if(url) newImageUrls.push(url) })
    }

    // Combine: Kept Existing URLs + New Uploaded URLs
    const finalImages = [...existingImages, ...newImageUrls]

    // Update DB
    await Food.findByIdAndUpdate(validation.data.id, {
      name: validation.data.name,
      category: validation.data.category,
      description: validation.data.description,
      images: finalImages
    })
    
    revalidatePath("/restaurant/")
    return { success: true }

  } catch (error) {
    console.error("Update error:", error)
    return { success: false, error: "Failed to update item" }
  }
}


export async function getMenuHistory(from: string, to: string) {
  try {
    await connectToDatabase();

    const menus = await Menu.find({
      date: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    })
    // FIX 1: Populate the nested path 'items.food'
    .populate({
      path: "items.food", 
      model: Food,
      select: "name category ", 
    })
    .sort({ date: -1 })
    .lean();

    const formattedData = menus.map((menu: any) => ({
      date: menu.date.toISOString().split("T")[0],
      
      // FIX 2: Handle the nested structure during mapping
      // The structure is now: item -> { food: { name, price... }, isSoldOut: boolean }
      items: (menu.items || []).map((item: any) => {
        // Safety check: ensure the food was actually populated (it might be null if deleted)
        const foodDetails = item.food; 

        if (!foodDetails) return null;

        return {
          _id: foodDetails._id.toString(),
          name: foodDetails.name,
          category: foodDetails.category,
          price: foodDetails.price,
          // Optional: You can pass isSoldOut back if you want to display it
          // isSoldOut: item.isSoldOut 
        };
      }).filter((item: any) => item !== null), // Remove any nulls if food was missing
    }));

    return formattedData;

  } catch (error) {
    console.error("Failed to fetch menu history:", error);
    return [];
  }
}

export async function getWeeklySchedule(from: string, to: string) {
  try {
    await connectToDatabase();
    
    // Find menus within the date range
    const menus = await Menu.find({
      date: { $gte: new Date(from), $lte: new Date(to) }
    }).lean();

    // Transform into the format the Planner expects: { "YYYY-MM-DD": ["foodId1", "foodId2"] }
    const scheduleMap: Record<string, string[]> = {};

    // note important menus 
    
    menus.forEach((menu: any) => {
      const dateKey = menu.date.toISOString().split("T")[0];
      // Extract just the Food IDs from the nested items structure
      const foodIds = menu.items.map((item: any) => item.food.toString());
      scheduleMap[dateKey] = foodIds;
    });

    return scheduleMap;
  } catch (error) {
    console.error("Failed to fetch weekly schedule:", error);
    return {};
  }
}

export async function clearWeeklySchedule(from: string, to: string) {
  try {
    await connectToDatabase();
    
    // Delete menus within the date range
    await Menu.deleteMany({
      date: { $gte: new Date(from), $lte: new Date(to) }
    });

    revalidatePath("/restaurant/menu");
    return { success: true };
  } catch (error) {
    console.error("Failed to clear schedule:", error);
    return { success: false, error: "Failed to delete schedule" };
  }
}



export async function getStaffWeeklySchedule() {
  try {
    await connectToDatabase();

    // 1. Calculate Monday & Friday of the CURRENT week
    const today = new Date();
    const day = today.getDay(); // 0=Sun, 1=Mon...
    
    // Logic: If Sun(0), go back 6 days to Mon. Else go back (day-1) days.
    const diffToMon = today.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(today);
    monday.setDate(diffToMon);
    monday.setHours(0, 0, 0, 0);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4); // Mon + 4 days = Fri
    friday.setHours(23, 59, 59, 999);

    // 2. Fetch Menus in Range
    const menus = await Menu.find({
      date: { $gte: monday, $lte: friday }
    })
    .populate({
      path: "items.food",
      model: Food,
      select: "name category images price" // Ensure 'price' is in your Food Schema!
    })
    .lean();

    // 3. Normalize Data for Frontend (Ensure all 5 days exist)
    const schedule = [];
    const iterator = new Date(monday);

    for (let i = 0; i < 5; i++) {
      // Create a string key "YYYY-MM-DD" for comparison
      const dateKey = iterator.toISOString().split("T")[0];
      
      const foundMenu = menus.find((m: any) => 
        m.date.toISOString().split("T")[0] === dateKey
      );

      // Map items if menu exists
      const items = foundMenu ? foundMenu.items
        .filter((item: any) => item.food) // Safety check for deleted foods
        .map((item: any) => ({
          id: item.food._id.toString(),
          name: item.food.name,
          category: item.food.category,
          price: item.food.price || 0, // Fallback if price missing
          image: item.food.images?.[0] || null,
          isSoldOut: item.isSoldOut
        })) 
        : [];

      schedule.push({
        date: new Date(iterator), // Pass actual Date object
        dayName: iterator.toLocaleDateString("en-US", { weekday: "long" }),
        items: items
      });

      // Move to next day
      iterator.setDate(iterator.getDate() + 1);
    }

    return { success: true, schedule };
  } catch (e) {
    console.error("Weekly Schedule Error:", e);
    return { success: false, schedule: [] };
  }
}


export async function getLiveOrders(dateFilter?: string) {
  try {
    await connectToDatabase();

    // Default to today if no date provided
    let dateQuery = {};
    if (dateFilter) {
       const start = new Date(dateFilter);
       start.setHours(0,0,0,0);
       const end = new Date(dateFilter);
       end.setHours(23,59,59,999);
       dateQuery = { date: { $gte: start, $lt: end } };
    } else {
       // Default: Get EVERYTHING that is not completed/cancelled (Live View)
       // OR get today's completed items
       const startToday = new Date();
       startToday.setHours(0,0,0,0);
       
       dateQuery = {
         $or: [
            { status: { $in: ["pending", "confirmed", "ready"] } }, // Always show live work
            { status: { $in: ["picked_up", "cancelled"] }, date: { $gte: startToday } } // Show today's history
         ]
       };
    }

    const orders = await Order.find(dateQuery)
    .populate("user", "name department branch image")
    .sort({ createdAt: 1 }) // FIFO (First In, First Out)
    .lean();

    return {
      success: true,
      orders: orders.map((order: any) => ({
        ...order,
        _id: order._id.toString(),
        user: order.user ? { ...order.user, _id: order.user._id.toString() } : null,
        items: order.items.map((i: any) => ({ ...i, _id: undefined }))
      }))
    };

  } catch (error) {
    console.error("Kitchen Fetch Error:", error);
    return { success: false, orders: [] };
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await connectToDatabase();
    
    // We remove the strict check that prevented editing 'picked_up' orders
    // to allow reversals. However, we should still ensure the order exists.
    const currentOrder = await Order.findById(orderId);
    if (!currentOrder) return { success: false, error: "Order not found" };
    
    // Update the status
    await Order.findByIdAndUpdate(orderId, { status: newStatus });
    
    revalidatePath("/kitchen/orders"); // Ensure this matches your actual page route
    return { success: true };
  } catch (error) {
    console.error("Status Update Error:", error);
    return { success: false, error: "Failed to update status" };
  }
}