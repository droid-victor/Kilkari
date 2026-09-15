import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WishlistItem } from '@/types/product'

interface WishlistState {
  items: WishlistItem[]
  toggle: (productId: string) => void
  isWishlisted: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (productId) =>
        set((state) => {
          const exists = state.items.some((i) => i.productId === productId)
          if (exists) {
            return { items: state.items.filter((i) => i.productId !== productId) }
          }
          return { items: [...state.items, { productId, addedAt: new Date().toISOString() }] }
        }),

      isWishlisted: (productId) => get().items.some((i) => i.productId === productId),
    }),
    { name: 'little-nest-wishlist' },
  ),
)
