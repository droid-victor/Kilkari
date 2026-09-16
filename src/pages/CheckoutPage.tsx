import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck, Store, CreditCard, Smartphone, Landmark, Wallet, Banknote } from 'lucide-react'
import type { Product } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { getAllProducts } from '@/services/productService'
import { formatPrice } from '@/utils/format'
import { businessConfig } from '@/config/business'
import { Button } from '@/components/ui/Button'
import { getEffectivePrice } from '@/utils/sale'

type DeliveryMethod = 'delivery' | 'pickup'
type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'

const paymentOptions: { value: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
  { value: 'upi', label: 'UPI', icon: Smartphone },
  { value: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { value: 'netbanking', label: 'Net Banking', icon: Landmark },
  { value: 'wallet', label: 'Wallets', icon: Wallet },
  { value: 'cod', label: 'Cash on Delivery', icon: Banknote },
]

export function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const [products, setProducts] = useState<Product[]>([])
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi')
  const [placing, setPlacing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getAllProducts().then(setProducts)
  }, [])

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
    }
  }, [items.length, navigate])

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
  const deliveryFee =
    deliveryMethod === 'pickup' || subtotal >= businessConfig.freeShippingThreshold
      ? 0
      : businessConfig.standardDeliveryFee
  const total = subtotal + deliveryFee

  if (items.length === 0) {
    return null
  }

  function handlePlaceOrder() {
    setPlacing(true)
    setTimeout(() => {
      clearCart()
      navigate('/order-confirmation')
    }, 900)
  }

  return (
    <div className="container-page py-6 sm:py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="text-sm font-semibold text-ink-900 mb-3">1. Delivery Address</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                placeholder="Full Name"
                className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
              />
              <input
                placeholder="Phone Number"
                type="tel"
                className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
              />
              <input
                placeholder="Address Line 1"
                className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm sm:col-span-2 focus:outline-none focus:border-terracotta-500"
              />
              <input
                placeholder="City"
                className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
              />
              <input
                placeholder="Pincode"
                inputMode="numeric"
                className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
              />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-ink-900 mb-3">2. Delivery Method</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`flex items-center gap-3 rounded-lg border p-4 text-left cursor-pointer ${
                  deliveryMethod === 'delivery' ? 'border-ink-900' : 'border-ink-900/15'
                }`}
              >
                <Truck size={20} />
                <div>
                  <p className="text-sm font-medium">Home Delivery</p>
                  <p className="text-xs text-ink-400">2-3 business days</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`flex items-center gap-3 rounded-lg border p-4 text-left cursor-pointer ${
                  deliveryMethod === 'pickup' ? 'border-ink-900' : 'border-ink-900/15'
                }`}
              >
                <Store size={20} />
                <div>
                  <p className="text-sm font-medium">Store Pickup</p>
                  <p className="text-xs text-ink-400">Ready within hours</p>
                </div>
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-ink-900 mb-3">3. Payment Method</h2>
            <div className="flex flex-col gap-2">
              {paymentOptions.map((opt) => {
                if (opt.value === 'cod' && !businessConfig.codAvailable) return null
                const Icon = opt.icon
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 rounded-lg border p-3.5 cursor-pointer ${
                      paymentMethod === opt.value ? 'border-ink-900' : 'border-ink-900/15'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                      className="h-4 w-4"
                    />
                    <Icon size={18} />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                )
              })}
            </div>
            <p className="text-xs text-ink-400 mt-2">
              This is a demo checkout. No real payment is processed.
            </p>
          </section>
        </div>

        <div className="flex flex-col gap-4 h-fit rounded-card bg-cream-100/60 p-4">
          <h2 className="text-sm font-semibold text-ink-900">Order Summary</h2>
          {lineItems.map(({ item, product }) => (
            <div key={`${product.id}-${item.size}-${item.color}`} className="flex justify-between text-sm">
              <span className="text-ink-600 line-clamp-1 pr-2">
                {product.name} x{item.quantity}
              </span>
              <span className="shrink-0">{formatPrice(getEffectivePrice(product) * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm pt-2 border-t border-ink-900/10">
            <span className="text-ink-600">Delivery</span>
            <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t border-ink-900/10">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button size="lg" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </div>
  )
}
