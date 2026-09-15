import type { Product } from '@/types/product'
import { ProductCard } from '@/components/product/ProductCard'

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
        <p className="text-lg font-medium text-ink-800">No products found</p>
        <p className="text-sm text-ink-400">
          We couldn't find anything matching your filters. Try adjusting them.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
