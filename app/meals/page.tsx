"use client"
import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMealStore } from "@/lib/stores/meal-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface Meal {
  _id: string
  name: string
  description: string
  price: number
  availableQuantity: number
}

export default function MealsPage() {
  const { status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { filters, setSearch, setSortBy, setSortOrder } = useMealStore()
  const [meals, setMeals] = useState<Meal[]>([])
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    const search = searchParams.get("search") || ""
    const sortBy = (searchParams.get("sortBy") as "name" | "price") || "name"
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc"

    if (search !== filters.search) setSearch(search)
    if (sortBy !== filters.sortBy) setSortBy(sortBy)
    if (sortOrder !== filters.sortOrder) setSortOrder(sortOrder)
  }, [searchParams, filters, setSearch, setSortBy, setSortOrder])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const fetchMeals = useCallback(async () => {
    try {
      const res = await fetch("/api/meals")
      if (!res.ok) throw new Error("Failed to fetch meals")
      const data = await res.json()
      setMeals(data)
    } catch (error) {
      console.error("[v0] Failed to fetch meals:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load meals. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchMeals()
  }, [fetchMeals])

  useEffect(() => {
    let result = [...meals]

    if (filters.search) {
      result = result.filter(
        (meal) =>
          meal.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          meal.description.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    result.sort((a, b) => {
      const compareValue = filters.sortBy === "name" ? a.name.localeCompare(b.name) : a.price - b.price

      return filters.sortOrder === "asc" ? compareValue : -compareValue
    })

    setFilteredMeals(result)
  }, [meals, filters])

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, String(value))
      else params.delete(key)
    })
    router.push(`/meals?${params.toString()}`)
  }

  const handleOrder = async (mealId: string) => {
    const quantity = orderQuantities[mealId] || 1
    setSubmitting(mealId)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealId, quantity }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }

      toast({
        title: "Success",
        description: "Order placed successfully!",
      })
      setOrderQuantities({ ...orderQuantities, [mealId]: 1 })
      await fetchMeals()
    } catch (error) {
      console.error("[v0] Error placing order:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order",
      })
    } finally {
      setSubmitting(null)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold hover:opacity-80">
            Order Meals
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/api/auth/signout?callbackUrl=/">Sign out</Link>
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold">Available Meals</h1>
          <div className="flex gap-4 flex-wrap">
            <Input
              placeholder="Search meals..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="max-w-xs"
            />
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange({ sortBy: value as "name" | "price" })}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="price">Sort by Price</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.sortOrder}
              onValueChange={(value) => handleFilterChange({ sortOrder: value as "asc" | "desc" })}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredMeals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {meals.length === 0 ? "No meals available right now" : "No meals match your search"}
            </p>
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeals.map((meal) => (
              <Card key={meal._id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{meal.name}</CardTitle>
                  <CardDescription>{meal.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">${meal.price.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground">{meal.availableQuantity} available</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      max={meal.availableQuantity}
                      value={orderQuantities[meal._id] || 1}
                      onChange={(e) =>
                        setOrderQuantities({
                          ...orderQuantities,
                          [meal._id]: Math.min(
                            Math.max(1, Number.parseInt(e.target.value) || 1),
                            meal.availableQuantity,
                          ),
                        })
                      }
                      className="w-20"
                      disabled={submitting === meal._id}
                    />
                    <Button
                      onClick={() => handleOrder(meal._id)}
                      disabled={meal.availableQuantity === 0 || submitting === meal._id}
                      className="flex-1"
                    >
                      {submitting === meal._id ? (
                        <>
                          <Spinner className="mr-2" />
                          Ordering...
                        </>
                      ) : meal.availableQuantity === 0 ? (
                        "Out of Stock"
                      ) : (
                        "Order"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
