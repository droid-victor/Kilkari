import { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Truck, Store, CreditCard, Smartphone, Landmark, Wallet, Banknote, AlertCircle } from 'lucide-react'
import type { Product, DeliveryMethod, PaymentMethod } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { getAllProducts } from '@/services/productService'
import { placeOrder } from '@/services/orderService'
import { isPincodeServiceable } from '@/config/delivery'
import { formatPrice } from '@/utils/format'
import { businessConfig } from '@/config/business'
import { Button } from '@/components/ui/Button'
import { getEffectivePrice } from '@/utils/sale'

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
  const user = useAuthStore((s) => s.user)
  const authLoading = useAuthStore((s) => s.loading)
  const [products, setProducts] = useState<Product[]>([])
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi')
  const [placing, setPlacing] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')

  useEffect(() => {
    getAllProducts().then(setProducts)
  }, [])

  useEffect(() => {
    // Skip the empty-cart redirect once an order has been placed — clearCart()
    // runs right after navigating to the confirmation page, and without this
    // guard that state change fires this effect and races the navigation,
    // sometimes bouncing the user to /cart instead of /order-confirmation.
    if (items.length === 0 && !placing) {
      navigate('/cart')
    }
  }, [items.length, navigate, placing])

  useEffect(() => {
    if (user) {
      setFullName((prev) => prev || user.displayName || '')
    }
  }, [user])

  if (authLoading) {
    return <div className="container-page py-16 text-center text-sm text-ink-400">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: '/checkout' }} replace />
  }

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

  async function handlePlaceOrder() {
    setFormError(null)

    if (!fullName.trim() || !phone.trim() || !addressLine1.trim() || !city.trim() || !pincode.trim()) {
      setFormError('Please fill in all delivery address fields.')
      return
    }
    if (deliveryMethod === 'delivery' && !isPincodeServiceable(pincode)) {
      setFormError('Sorry, we currently only deliver to Sultanpur (228001). Choose Store Pickup instead.')
      return
    }

    setPlacing(true)
    try {
      const orderNumber = await placeOrder({
        userId: user!.uid,
        items: lineItems.map(({ item, product }) => ({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0] ?? '',
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: getEffectivePrice(product),
        })),
        address: { fullName, phone, line1: addressLine1, city, pincode },
        deliveryMethod,
        paymentMethod,
        subtotal,
        deliveryFee,
        total,
      })
      navigate('/order-confirmation', { state: { orderNumber } })
      clearCart()
      // Deliberately leave `placing` true on success — the component is
      // navigating away, and resetting it here would race the empty-cart
      // redirect effect above (see its comment).
    } catch {
      setFormError('Something went wrong placing your order. Please try again.')
      setPlacing(false)
    }
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
              />
              <input
                placeholder="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
              />
              <input
                placeholder="Address Line 1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm sm:col-span-2 focus:outline-none focus:border-terracotta-500"
              />
              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
              />
              <input
                placeholder="Pincode"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
              />
            </div>
            {deliveryMethod === 'delivery' && pincode.length === 6 && !isPincodeServiceable(pincode) && (
              <p className="flex items-center gap-1.5 text-xs text-error-500 mt-2">
                <AlertCircle size={14} /> We currently only deliver to Sultanpur (228001). Choose
                Store Pickup below instead.
              </p>
            )}
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
                  <p className="text-xs text-ink-400">Sultanpur (228001) only, for now</p>
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
          {formError && <p className="text-sm text-error-500">{formError}</p>}
          <Button size="lg" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </div>
  )
}
