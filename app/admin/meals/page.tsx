import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminMealsClient } from "@/components/admin/admin-meals-client"

export const metadata: Metadata = {
  title: "Manage Meals | Staff Meal Ordering Admin",
  description: "Add, edit, and manage meal options available for staff ordering",
}

export default async function AdminMealsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  return <AdminMealsClient />
}
