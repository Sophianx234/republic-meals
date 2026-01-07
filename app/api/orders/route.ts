import { getDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"
import { z } from "zod"

const createOrderSchema = z.object({
  mealId: z.string().min(1, "Meal ID required"),
  quantity: z.number().int().positive("Quantity must be positive"),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const query = session.user?.role === "admin" ? {} : { userId: session.user?.id }

    const orders = await db.collection("orders").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const { mealId, quantity } = createOrderSchema.parse(body)

    const db = await getDatabase()

    const meal = await db.collection("meals").findOne({
      _id: new ObjectId(mealId),
    })

    if (!meal) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 })
    }

    if (meal.availableQuantity < quantity) {
      return NextResponse.json({ error: "Insufficient quantity available" }, { status: 400 })
    }

    const result = await db.collection("orders").insertOne({
      userId: session.user?.id,
      userName: session.user?.name,
      mealId: new ObjectId(mealId),
      mealName: meal.name,
      quantity,
      totalPrice: meal.price * quantity,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Update meal quantity
    await db
      .collection("meals")
      .updateOne(
        { _id: new ObjectId(mealId) },
        { $inc: { availableQuantity: -quantity }, $set: { updatedAt: new Date() } },
      )

    return NextResponse.json({ message: "Order created", orderId: result.insertedId }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
