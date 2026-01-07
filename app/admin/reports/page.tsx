import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminReportsClient } from "@/components/admin/admin-reports-client"

export const metadata: Metadata = {
  title: "Reports | Staff Meal Ordering Admin",
  description: "View sales reports, revenue analytics, and top meal statistics",
}

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  return <AdminReportsClient />
}
