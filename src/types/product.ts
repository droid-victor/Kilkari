export type Gender = 'boys' | 'girls' | 'New Born' | 'unisex'

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

export interface ProductSale {
  discountPercent: number
  startsAt: string | null
  endsAt: string | null
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
  sale?: ProductSale | null
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

export interface CustomerProfile {
  uid: string
  name: string
  email: string
  phone?: string
  createdAt: string
}

export interface OrderItem {
  productId: string
  name: string
  slug: string
  image: string
  size: string
  color: string
  quantity: number
  price: number
}

export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered'
export type DeliveryMethod = 'delivery' | 'pickup'
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'

export interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  address: {
    fullName: string
    phone: string
    line1: string
    city: string
    pincode: string
  }
  deliveryMethod: DeliveryMethod
  paymentMethod: PaymentMethod
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  createdAt: string
}
