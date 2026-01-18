import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminStaffClient } from "@/components/admin/admin-staff-client"

export const metadata: Metadata = {
  title: "Manage Staff | Staff Meal Ordering Admin",
  description: "View all staff members and user accounts",
}

export default async function AdminStaffPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  return <AdminStaffClient />
}
