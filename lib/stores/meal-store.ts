import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface MealFilter {
  search: string
  sortBy: "name" | "price"
  sortOrder: "asc" | "desc"
}

interface MealStoreState {
  filters: MealFilter
  setSearch: (search: string) => void
  setSortBy: (sortBy: "name" | "price") => void
  setSortOrder: (order: "asc" | "desc") => void
  resetFilters: () => void
}

const initialFilters: MealFilter = {
  search: "",
  sortBy: "name",
  sortOrder: "asc",
}

export const useMealStore = create<MealStoreState>()(
  devtools(
    persist(
      (set) => ({
        filters: initialFilters,
        setSearch: (search) =>
          set((state) => ({
            filters: { ...state.filters, search },
          })),
        setSortBy: (sortBy) =>
          set((state) => ({
            filters: { ...state.filters, sortBy },
          })),
        setSortOrder: (sortOrder) =>
          set((state) => ({
            filters: { ...state.filters, sortOrder },
          })),
        resetFilters: () =>
          set({
            filters: initialFilters,
          }),
      }),
      {
        name: "meal-store",
      },
    ),
  ),
)
