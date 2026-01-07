import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client"

export const metadata: Metadata = {
  title: "Admin Dashboard | Staff Meal Ordering",
  description: "Manage meals, orders, staff, and view sales reports",
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard")
  }

  return <AdminDashboardClient />
}
