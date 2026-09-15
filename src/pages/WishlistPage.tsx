import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import type { Product } from '@/types/product'
import { useWishlistStore } from '@/store/wishlistStore'
import { getAllProducts } from '@/services/productService'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/Button'

export function WishlistPage() {
  const wishlistItems = useWishlistStore((s) => s.items)
  const [products, setProducts] = useState<Product[] | null>(null)

  useEffect(() => {
    getAllProducts().then(setProducts)
  }, [])

  const wishlistedProducts = (products ?? []).filter((p) =>
    wishlistItems.some((w) => w.productId === p.id),
  )

  if (products && wishlistedProducts.length === 0) {
    return (
      <div className="container-page py-16 flex flex-col items-center text-center gap-3">
        <Heart size={40} className="text-ink-400" />
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Your wishlist is waiting for some favourites
        </h1>
        <p className="text-ink-600">Save items you love and find them here anytime.</p>
        <Link to="/shop">
          <Button className="mt-2">Explore Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-page py-6 sm:py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 mb-6">
        My Wishlist
      </h1>
      {products == null ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-card bg-cream-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <ProductGrid products={wishlistedProducts} />
      )}
    </div>
  )
}
