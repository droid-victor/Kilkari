import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { Product } from '@/types/product'
import { ProductPrice } from '@/components/product/ProductPrice'
import { WishlistButton } from '@/components/product/WishlistButton'
import { RatingStars } from '@/components/ui/RatingStars'
import { Badge } from '@/components/ui/Badge'
import { StockBadge } from '@/components/product/StockBadge'
import { getEffectivePrice, isSaleActive } from '@/utils/sale'

export function ProductCard({ product }: { product: Product }) {
  const [imgIndex, setImgIndex] = useState(0)
  const secondImage = product.images[1]
  const effectivePrice = getEffectivePrice(product)
  const onSale = isSaleActive(product)

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col rounded-card overflow-hidden bg-cream-100/60 hover:shadow-lifted transition-shadow duration-200"
    >
      <div
        className="relative aspect-square bg-cream-200 overflow-hidden"
        onMouseEnter={() => secondImage && setImgIndex(1)}
        onMouseLeave={() => setImgIndex(0)}
      >
        <img
          src={product.images[imgIndex] ?? product.images[0]}
          alt={product.name}
          loading="lazy"
          width={600}
          height={600}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {onSale && <Badge tone="error">Sale</Badge>}
          {product.newArrival && <Badge tone="sage">New</Badge>}
          {product.bestSeller && <Badge tone="terracotta">Bestseller</Badge>}
        </div>
        <WishlistButton productId={product.id} className="absolute top-2 right-2" />
        <div className="absolute bottom-2 left-2">
          <StockBadge product={product} />
        </div>
      </div>

      <div className="flex flex-col gap-1 p-3">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
          {product.brand}
        </span>
        <h3 className="text-sm font-medium text-ink-900 leading-snug line-clamp-2">
          {product.name}
        </h3>
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={12} />
        <ProductPrice price={effectivePrice} mrp={product.mrp} size="sm" />
      </div>
    </Link>
  )
}
