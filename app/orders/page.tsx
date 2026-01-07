import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { OrdersClientPage } from "@/components/orders/orders-client-page"

export const metadata: Metadata = {
  title: "My Orders | Staff Meal Ordering",
  description: "View your meal orders and track their status",
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <OrdersClientPage userId={session.user.id} />
}
