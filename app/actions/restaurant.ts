"use server"

import { auth } from "@/lib/auth"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { connectToDatabase } from "@/lib/mongodb"
import { Food} from "@/models/food"
import { Menu } from "@/models/menu"
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
        price: f.price, // Snapshotting the price here!
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
    
    revalidatePath("/restaurant/menu")
    return { success: true }

  } catch (error) {
    console.error("Update error:", error)
    return { success: false, error: "Failed to update item" }
  }
}