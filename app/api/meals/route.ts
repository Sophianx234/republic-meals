import { getDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const createMealSchema = z.object({
  name: z.string().min(2, "Name required"),
  description: z.string().min(5, "Description required"),
  price: z.number().positive("Price must be positive"),
  availableQuantity: z.number().int().positive("Quantity must be positive"),
})

export async function GET() {
  try {
    const db = await getDatabase()
    const meals = await db.collection("meals").find({ isActive: true }).toArray()

    return NextResponse.json(meals)
  } catch (error) {
    console.error("Error fetching meals:", error)
    return NextResponse.json({ error: "Failed to fetch meals" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const { name, description, price, availableQuantity } = createMealSchema.parse(body)

    const db = await getDatabase()

    const result = await db.collection("meals").insertOne({
      name,
      description,
      price,
      availableQuantity,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ message: "Meal created", mealId: result.insertedId }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Error creating meal:", error)
    return NextResponse.json({ error: "Failed to create meal" }, { status: 500 })
  }
}
