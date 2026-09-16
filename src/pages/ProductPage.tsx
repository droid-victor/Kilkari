import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MessageCircle, Heart } from 'lucide-react'
import type { Product } from '@/types/product'
import { getProductBySlug, getRelatedProducts } from '@/services/productService'
import { ProductImageGallery } from '@/components/product/ProductImageGallery'
import { SizeSelector } from '@/components/product/SizeSelector'
import { ColorSelector } from '@/components/product/ColorSelector'
import { ProductPrice } from '@/components/product/ProductPrice'
import { RatingStars } from '@/components/ui/RatingStars'
import { Button } from '@/components/ui/Button'
import { StoreAvailability } from '@/components/store/StoreAvailability'
import { PincodeChecker } from '@/components/store/PincodeChecker'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { buildWhatsappUrl, productInquiryMessage } from '@/services/whatsappService'
import { getEffectivePrice } from '@/utils/sale'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null | undefined>(undefined)
  const [related, setRelated] = useState<Product[]>([])
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [addedMessage, setAddedMessage] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product?.id ?? ''))
  const toggleWishlist = useWishlistStore((s) => s.toggle)

  useEffect(() => {
    if (!slug) return
    getProductBySlug(slug).then((p) => {
      setProduct(p ?? null)
      if (p) {
        setSelectedSize(p.sizes[0] ?? null)
        setSelectedColor(p.colors[0]?.name ?? null)
        getRelatedProducts(p).then(setRelated)
      }
    })
  }, [slug])

  if (product === undefined) {
    return <div className="container-page py-10 text-sm text-ink-400">Loading...</div>
  }

  if (product === null) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Product not found</h1>
        <p className="text-ink-600 mt-2">This product may have been removed or the link is incorrect.</p>
        <Link to="/shop" className="inline-block mt-4 text-terracotta-600 font-medium">
          Continue Shopping
        </Link>
      </div>
    )
  }

  const totalStock = product.onlineStock + product.storeStock
  const canAddToCart = product.onlineStock > 0 && (product.sizes.length === 0 || !!selectedSize)
  const effectivePrice = getEffectivePrice(product)

  function handleAddToCart() {
    if (!product || !canAddToCart) return
    addItem({
      productId: product.id,
      size: selectedSize ?? 'Free Size',
      color: selectedColor ?? product.colors[0]?.name ?? 'Default',
      quantity: 1,
    })
    setAddedMessage(true)
    setTimeout(() => setAddedMessage(false), 2000)
  }

  function handleBuyNow() {
    handleAddToCart()
    navigate('/cart')
  }

  return (
    <div className="container-page py-6 sm:py-10 pb-28 lg:pb-10">
      <nav aria-label="Breadcrumb" className="text-xs text-ink-400 mb-4">
        <ol className="flex items-center gap-1">
          <li>Home</li>
          <li aria-hidden="true">/</li>
          <li className="capitalize">{product.category}</li>
          <li aria-hidden="true">/</li>
          <li className="text-ink-800 line-clamp-1">{product.name}</li>
        </ol>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductImageGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
              {product.brand}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 mt-1">
              {product.name}
            </h1>
          </div>

          <RatingStars rating={product.rating} reviewCount={product.reviewCount} showValue size={16} />

          <ProductPrice price={effectivePrice} mrp={product.mrp} size="lg" />

          {totalStock === 0 && (
            <p className="text-sm font-medium text-error-500">Currently out of stock</p>
          )}

          {product.colors.length > 0 && (
            <div>
              <p className="text-sm font-medium text-ink-900 mb-2">
                Color{selectedColor ? `: ${selectedColor}` : ''}
              </p>
              <ColorSelector
                colors={product.colors}
                selected={selectedColor}
                onSelect={setSelectedColor}
              />
            </div>
          )}

          {product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-ink-900">
                  Size{selectedSize ? `: ${selectedSize}` : ''}
                </p>
                <Link to="/size-guide" className="text-xs font-medium text-terracotta-600">
                  Size Guide
                </Link>
              </div>
              <SizeSelector sizes={product.sizes} selected={selectedSize} onSelect={setSelectedSize} />
            </div>
          )}

          <div className="hidden lg:flex gap-3 mt-2">
            <Button
              variant="outline"
              size="lg"
              className="!w-14 !px-0 shrink-0"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart size={20} className={isWishlisted ? 'fill-terracotta-600 text-terracotta-600' : ''} />
            </Button>
            <Button variant="outline" size="lg" fullWidth disabled={!canAddToCart} onClick={handleAddToCart}>
              {addedMessage ? 'Added!' : 'Add to Cart'}
            </Button>
            <Button size="lg" fullWidth disabled={!canAddToCart} onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>

          <a
            href={buildWhatsappUrl(productInquiryMessage(product, selectedSize ?? undefined))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-sage-600 hover:text-sage-700 w-fit"
          >
            <MessageCircle size={16} /> Ask on WhatsApp
          </a>

          <StoreAvailability product={product} />

          <div>
            <p className="text-sm font-medium text-ink-900 mb-2">Check Delivery</p>
            <PincodeChecker />
          </div>

          <div className="pt-2">
            <h2 className="text-sm font-semibold text-ink-900 mb-1">Product Details</h2>
            <p className="text-sm text-ink-600">{product.description}</p>
            {product.material && (
              <p className="text-sm text-ink-600 mt-2">
                <span className="font-medium text-ink-800">Material:</span> {product.material}
              </p>
            )}
            {product.careInstructions && (
              <p className="text-sm text-ink-600 mt-1">
                <span className="font-medium text-ink-800">Care:</span> {product.careInstructions}
              </p>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-ink-900 mb-5">You May Also Like</h2>
          <ProductCarousel products={related} />
        </section>
      )}

      {/* Sticky mobile CTA */}
      <div
        className="lg:hidden fixed left-0 right-0 z-30 bg-cream-50 border-t border-ink-900/8 p-3 flex gap-2"
        style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => toggleWishlist(product.id)}
          className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl border border-ink-900/15 cursor-pointer"
        >
          <Heart size={20} className={isWishlisted ? 'fill-terracotta-600 text-terracotta-600' : ''} />
        </button>
        <Button variant="outline" fullWidth disabled={!canAddToCart} onClick={handleAddToCart}>
          {addedMessage ? 'Added!' : 'Add to Cart'}
        </Button>
        <Button fullWidth disabled={!canAddToCart} onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>
    </div>
  )
}
