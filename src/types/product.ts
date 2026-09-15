export type Gender = 'boys' | 'girls' | 'baby' | 'unisex'

export type AgeGroup =
  | '0-3m'
  | '3-12m'
  | '1-3y'
  | '4-7y'
  | '8-12y'
  | '13-16y'

export type ProductCategory = 'clothing' | 'footwear' | 'toys' | 'accessories'

export interface ProductVariantColor {
  name: string
  hex: string
}

export interface ProductReview {
  id: string
  author: string
  rating: number
  title?: string
  comment: string
  date: string
  verifiedPurchase: boolean
  images?: string[]
  helpfulCount: number
}

export interface Product {
  id: string
  sku: string
  slug: string
  name: string
  brand: string
  category: ProductCategory
  subcategory: string
  gender: Gender
  ageGroup: AgeGroup[]
  description: string
  shortDescription: string
  images: string[]
  price: number
  mrp: number
  sizes: string[]
  colors: ProductVariantColor[]
  material?: string
  careInstructions?: string
  rating: number
  reviewCount: number
  reviews?: ProductReview[]
  onlineStock: number
  storeStock: number
  pickupAvailable: boolean
  featured?: boolean
  newArrival?: boolean
  bestSeller?: boolean
  trending?: boolean
  tags: string[]
}

export interface CartItem {
  productId: string
  size: string
  color: string
  quantity: number
}

export interface WishlistItem {
  productId: string
  addedAt: string
}
