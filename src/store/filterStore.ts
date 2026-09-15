import { create } from 'zustand'
import type { Gender, AgeGroup } from '@/types/product'

export interface FilterState {
  genders: Gender[]
  ageGroups: AgeGroup[]
  sizes: string[]
  colors: string[]
  brands: string[]
  priceMin: number | null
  priceMax: number | null
  minRating: number | null
  onSaleOnly: boolean
  pickupOnly: boolean
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'discount'

  toggleGender: (g: Gender) => void
  toggleAgeGroup: (a: AgeGroup) => void
  toggleSize: (s: string) => void
  toggleColor: (c: string) => void
  toggleBrand: (b: string) => void
  setPriceRange: (min: number | null, max: number | null) => void
  setMinRating: (r: number | null) => void
  setOnSaleOnly: (v: boolean) => void
  setPickupOnly: (v: boolean) => void
  setSortBy: (s: FilterState['sortBy']) => void
  reset: () => void
}

const initialFilters = {
  genders: [] as Gender[],
  ageGroups: [] as AgeGroup[],
  sizes: [] as string[],
  colors: [] as string[],
  brands: [] as string[],
  priceMin: null,
  priceMax: null,
  minRating: null,
  onSaleOnly: false,
  pickupOnly: false,
  sortBy: 'relevance' as const,
}

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

export const useFilterStore = create<FilterState>()((set) => ({
  ...initialFilters,

  toggleGender: (g) => set((state) => ({ genders: toggleInArray(state.genders, g) })),
  toggleAgeGroup: (a) => set((state) => ({ ageGroups: toggleInArray(state.ageGroups, a) })),
  toggleSize: (s) => set((state) => ({ sizes: toggleInArray(state.sizes, s) })),
  toggleColor: (c) => set((state) => ({ colors: toggleInArray(state.colors, c) })),
  toggleBrand: (b) => set((state) => ({ brands: toggleInArray(state.brands, b) })),
  setPriceRange: (min, max) => set({ priceMin: min, priceMax: max }),
  setMinRating: (r) => set({ minRating: r }),
  setOnSaleOnly: (v) => set({ onSaleOnly: v }),
  setPickupOnly: (v) => set({ pickupOnly: v }),
  setSortBy: (s) => set({ sortBy: s }),
  reset: () => set(initialFilters),
}))
