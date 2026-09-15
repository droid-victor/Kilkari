import type { AgeGroup, Gender, ProductCategory } from '@/types/product'

export interface CategoryTile {
  label: string
  slug: ProductCategory
  path: string
  image: string
}

export const categoryTiles: CategoryTile[] = [
  { label: 'Clothing', slug: 'clothing', path: '/clothing', image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Footwear', slug: 'footwear', path: '/footwear', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80' },
  { label: 'Toys', slug: 'toys', path: '/toys', image: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=800&q=80' },
  { label: 'Accessories', slug: 'accessories', path: '/accessories', image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80' },
]

export interface AgeTile {
  label: string
  value: AgeGroup
  image: string
}

export const ageTiles: AgeTile[] = [
  { label: '0-3 Months', value: '0-3m', image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80' },
  { label: '3-12 Months', value: '3-12m', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80' },
  { label: '1-3 Years', value: '1-3y', image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=800&q=80' },
  { label: '4-7 Years', value: '4-7y', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80' },
  { label: '8-12 Years', value: '8-12y', image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=800&q=80' },
  { label: '13-16 Years', value: '13-16y', image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=800&q=80' },
]

export interface GenderTile {
  label: string
  value: Gender
  path: string
  image: string
}

export const genderTiles: GenderTile[] = [
  { label: 'Boys', value: 'boys', path: '/boys', image: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Girls', value: 'girls', path: '/girls', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Baby', value: 'baby', path: '/baby', image: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&w=800&q=80' },
]

export const shopUnderPrices = [299, 499, 999, 1499, 2499]
