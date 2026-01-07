import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminOrdersClient } from "@/components/admin/admin-orders-client"

export const metadata: Metadata = {
  title: "Manage Orders | Staff Meal Ordering Admin",
  description: "View and manage all staff meal orders",
}

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  return <AdminOrdersClient />
}
