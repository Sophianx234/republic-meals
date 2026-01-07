import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dashboard | Staff Meal Ordering",
  description: "Your personal dashboard for meal ordering and management",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const isAdmin = session.user.role === "admin"

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-muted-foreground">{session.user.name}</span>
            <Button variant="ghost" asChild>
              <Link href="/api/auth/signout?callbackUrl=/">Sign out</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Order Meals</h2>
            <p className="text-muted-foreground mb-4">Browse and order available meals</p>
            <Button asChild>
              <Link href="/meals">Browse Meals</Link>
            </Button>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">My Orders</h2>
            <p className="text-muted-foreground mb-4">View your order history</p>
            <Button asChild variant="outline">
              <Link href="/orders">View Orders</Link>
            </Button>
          </div>

          {isAdmin && (
            <>
              <div className="border rounded-lg p-6 hover:shadow-lg transition">
                <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
                <p className="text-muted-foreground mb-4">Manage meals, orders, and staff</p>
                <Button asChild variant="outline">
                  <Link href="/admin">Go to Admin</Link>
                </Button>
              </div>

              <div className="border rounded-lg p-6 hover:shadow-lg transition">
                <h2 className="text-xl font-semibold mb-2">Manage Meals</h2>
                <p className="text-muted-foreground mb-4">Add and edit meal options</p>
                <Button asChild variant="outline">
                  <Link href="/admin/meals">Manage Meals</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
