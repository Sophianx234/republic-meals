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
    const orders = await db.collection("orders").find({}).toArray()

    const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0)
    const totalOrders = orders.length
    const completedOrders = orders.filter((order: any) => order.status === "completed").length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Group orders by meal to find top meals
    const mealCounts: Record<string, number> = {}
    orders.forEach((order: any) => {
      mealCounts[order.mealName] = (mealCounts[order.mealName] || 0) + 1
    })

    const topMeals = Object.entries(mealCounts)
      .map(([name, count]) => ({ name, orders: count }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      completedOrders,
      averageOrderValue,
      topMeals,
    })
  } catch (error) {
    console.error("Error generating reports:", error)
    return NextResponse.json({ error: "Failed to generate reports" }, { status: 500 })
  }
}
