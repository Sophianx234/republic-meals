import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
// import { RegisterClientPage } from "@/components/auth/register-client-page"

export const metadata: Metadata = {
  title: "Register | Staff Meal Ordering",
  description: "Create a new account to start ordering delicious meals from your company menu",
}

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return null
}
