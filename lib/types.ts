export interface User {
  _id: string
  email: string
  name: string
  password: string
  role: "staff" | "admin"
  createdAt: Date
  updatedAt: Date
}

export interface Meal {
  _id: string
  name: string
  description: string
  price: number
  availableQuantity: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  _id: string
  userId: string
  mealId: string
  quantity: number
  totalPrice: number
  status: "pending" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface AdminStats {
  totalOrders: number
  totalRevenue: number
  totalMeals: number
  pendingOrders: number
}

export interface SessionUser extends User {
  id: string
}
