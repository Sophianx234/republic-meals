import { z } from "zod"

export const emailSchema = z.string().email("Invalid email address")

export const passwordSchema = z.string().min(8, "Password must be at least 8 characters").min(1, "Password is required")

export const mealSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.number().positive("Price must be positive"),
  availableQuantity: z.number().int().positive("Quantity must be positive"),
})

export const orderSchema = z.object({
  mealId: z.string().min(1, "Meal ID is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
})
