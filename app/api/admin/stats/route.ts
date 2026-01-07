import { getDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()

    const [orders, meals] = await Promise.all([
      db.collection("orders").find({}).toArray(),
      db.collection("meals").find({}).toArray(),
    ])

    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0)
    const pendingOrders = orders.filter((order: any) => order.status === "pending").length
    const totalMeals = meals.length

    return NextResponse.json(
      {
        totalOrders,
        totalRevenue,
        pendingOrders,
        totalMeals,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
