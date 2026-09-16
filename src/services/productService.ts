import { fetchAllProductsOnce } from '@/services/inventoryService'
import type { Product, ProductCategory, Gender } from '@/types/product'
import type { FilterState } from '@/store/filterStore'
import { getEffectivePrice, isSaleActive } from '@/utils/sale'

// Backed by Firestore when configured (see config/firebase.ts), otherwise
// falls back to the bundled mock catalog — see inventoryService.ts.

export async function getAllProducts(): Promise<Product[]> {
  return fetchAllProductsOnce()
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await fetchAllProductsOnce()
  return products.find((p) => p.slug === slug)
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await fetchAllProductsOnce()
  return products.find((p) => p.id === id)
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  const products = await fetchAllProductsOnce()
  return products.filter((p) => p.category === category)
}

export async function getProductsByGender(gender: Gender): Promise<Product[]> {
  const products = await fetchAllProductsOnce()
  return products.filter((p) => p.gender === gender || p.gender === 'unisex')
}

export async function getNewArrivals(limit = 12): Promise<Product[]> {
  const products = await fetchAllProductsOnce()
  return products.filter((p) => p.newArrival).slice(0, limit)
}

export async function getBestSellers(limit = 12): Promise<Product[]> {
  const products = await fetchAllProductsOnce()
  return products.filter((p) => p.bestSeller).slice(0, limit)
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await fetchAllProductsOnce()
  return products.filter((p) => p.featured).slice(0, limit)
}

export async function getTrendingProducts(limit = 8): Promise<Product[]> {
  const products = await fetchAllProductsOnce()
  return products.filter((p) => p.trending).slice(0, limit)
}

export async function getRelatedProducts(product: Product, limit = 8): Promise<Product[]> {
  const products = await fetchAllProductsOnce()
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit)
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const products = await fetchAllProductsOnce()
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q)),
  )
}

export function applyFilters(list: Product[], filters: FilterState): Product[] {
  let result = list

  if (filters.genders.length) {
    result = result.filter((p) => filters.genders.includes(p.gender))
  }
  if (filters.ageGroups.length) {
    result = result.filter((p) => p.ageGroup.some((a) => filters.ageGroups.includes(a)))
  }
  if (filters.sizes.length) {
    result = result.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)))
  }
  if (filters.colors.length) {
    result = result.filter((p) => p.colors.some((c) => filters.colors.includes(c.name)))
  }
  if (filters.brands.length) {
    result = result.filter((p) => filters.brands.includes(p.brand))
  }
  if (filters.priceMin != null) {
    result = result.filter((p) => getEffectivePrice(p) >= filters.priceMin!)
  }
  if (filters.priceMax != null) {
    result = result.filter((p) => getEffectivePrice(p) <= filters.priceMax!)
  }
  if (filters.minRating != null) {
    result = result.filter((p) => p.rating >= filters.minRating!)
  }
  if (filters.onSaleOnly) {
    result = result.filter((p) => p.mrp > p.price || isSaleActive(p))
  }
  if (filters.pickupOnly) {
    result = result.filter((p) => p.pickupAvailable)
  }

  const sorted = [...result]
  switch (filters.sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b))
      break
    case 'price-desc':
      sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a))
      break
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating)
      break
    case 'discount':
      sorted.sort(
        (a, b) => b.mrp - getEffectivePrice(b) - (a.mrp - getEffectivePrice(a)),
      )
      break
    case 'newest':
      sorted.sort((a, b) => Number(b.newArrival) - Number(a.newArrival))
      break
    default:
      break
  }

  return sorted
}
