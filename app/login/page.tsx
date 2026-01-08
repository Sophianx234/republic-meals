import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"


export const metadata: Metadata = {
  title: "Sign In | Staff Meal Ordering",
  description: "Sign in to your account and start ordering meals",
}

export default async function LoginPage() {
  // const session = await getServerSession(authOptions)
  const session = false

  if (session) {
    redirect("/dashboard")
  }

  return <div>boruto </div>
}
