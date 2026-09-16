import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag } from 'lucide-react'
import type { Product } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { getAllProducts } from '@/services/productService'
import { formatPrice } from '@/utils/format'
import { businessConfig } from '@/config/business'
import { Button } from '@/components/ui/Button'
import { buildWhatsappUrl, cartOrderMessage } from '@/services/whatsappService'
import { getEffectivePrice } from '@/utils/sale'

export function CartPage() {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const [products, setProducts] = useState<Product[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    getAllProducts().then(setProducts)
  }, [])

  const lineItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return product ? { item, product } : null
    })
    .filter((x): x is { item: (typeof items)[number]; product: Product } => x !== null)

  const subtotal = lineItems.reduce(
    (sum, { item, product }) => sum + getEffectivePrice(product) * item.quantity,
    0,
  )
  const mrpTotal = lineItems.reduce((sum, { item, product }) => sum + product.mrp * item.quantity, 0)
  const discount = mrpTotal - subtotal
  const deliveryFee = subtotal >= businessConfig.freeShippingThreshold ? 0 : businessConfig.standardDeliveryFee
  const total = subtotal + deliveryFee
  const amountToFreeShipping = Math.max(0, businessConfig.freeShippingThreshold - subtotal)

  if (products.length > 0 && lineItems.length === 0) {
    return (
      <div className="container-page py-16 flex flex-col items-center text-center gap-3">
        <ShoppingBag size={40} className="text-ink-400" />
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Your cart is feeling a little empty
        </h1>
        <p className="text-ink-600">Add some favourites to get started.</p>
        <Link to="/shop">
          <Button className="mt-2">Start Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-page py-6 sm:py-10 pb-32 lg:pb-10">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 mb-6">
        Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-4">
          {lineItems.map(({ item, product }) => (
            <div key={`${product.id}-${item.size}-${item.color}`} className="flex gap-3 pb-4 border-b border-ink-900/8">
              <Link to={`/product/${product.slug}`} className="h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-cream-200">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.slug}`} className="text-sm font-medium text-ink-900 line-clamp-1">
                  {product.name}
                </Link>
                <p className="text-xs text-ink-400 mt-0.5">
                  Size: {item.size} · Color: {item.color}
                </p>
                <p className="text-sm font-semibold text-ink-900 mt-1">
                  {formatPrice(getEffectivePrice(product))}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-ink-900/15 rounded-lg">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(product.id, item.size, item.color, item.quantity - 1)}
                      className="h-9 w-9 flex items-center justify-center cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(product.id, item.size, item.color, item.quantity + 1)}
                      className="h-9 w-9 flex items-center justify-center cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeItem(product.id, item.size, item.color)}
                    className="p-2 text-ink-400 hover:text-error-500 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {lineItems.length > 0 && (
          <div className="flex flex-col gap-4">
            {amountToFreeShipping > 0 ? (
              <div className="rounded-card bg-sage-50 p-3 text-sm text-sage-600">
                Add {formatPrice(amountToFreeShipping)} more to get FREE delivery
              </div>
            ) : (
              <div className="rounded-card bg-sage-50 p-3 text-sm text-sage-600">
                You've unlocked FREE delivery!
              </div>
            )}

            <div className="rounded-card bg-cream-100/60 p-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-600">Subtotal</span>
                <span>{formatPrice(mrpTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Discount</span>
                <span className="text-sage-600">-{formatPrice(discount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Delivery</span>
                <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-ink-900/10">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button size="lg" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>

            <a
              href={buildWhatsappUrl(
                cartOrderMessage(
                  lineItems.map(({ item, product }) => ({
                    name: product.name,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity,
                    price: getEffectivePrice(product),
                  })),
                  total,
                ),
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 rounded-xl border border-sage-600 text-sage-600 text-sm font-medium hover:bg-sage-50"
            >
              <MessageCircle size={16} /> Order on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
