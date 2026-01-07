import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface OrderFilter {
  status: "all" | "pending" | "completed" | "cancelled"
  page: number
}

interface OrderStoreState {
  filters: OrderFilter
  setStatus: (status: OrderFilter["status"]) => void
  setPage: (page: number) => void
  resetFilters: () => void
}

const initialFilters: OrderFilter = {
  status: "all",
  page: 1,
}

export const useOrderStore = create<OrderStoreState>()(
  devtools((set) => ({
    filters: initialFilters,
    setStatus: (status) =>
      set((state) => ({
        filters: { ...state.filters, status, page: 1 },
      })),
    setPage: (page) =>
      set((state) => ({
        filters: { ...state.filters, page },
      })),
    resetFilters: () =>
      set({
        filters: initialFilters,
      }),
  })),
)
