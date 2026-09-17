import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, MapPin, Truck, Store, Loader2, CheckCircle2 } from 'lucide-react'
import type { Product, CartItem, DeliveryMethod, OrderLocation } from '@/types/product'
import { useAuthStore } from '@/store/authStore'
import { placeOrder } from '@/services/orderService'
import { buildWhatsappUrl, cartOrderMessage } from '@/services/whatsappService'
import { getCurrentLocation } from '@/utils/geolocation'
import { isPincodeServiceable } from '@/config/delivery'
import { getEffectivePrice } from '@/utils/sale'
import { formatPrice } from '@/utils/format'
import { Button } from '@/components/ui/Button'

export function WhatsappOrderPanel({
  lineItems,
  subtotal,
  deliveryFee,
  total,
  onOrdered,
}: {
  lineItems: { item: CartItem; product: Product }[]
  subtotal: number
  deliveryFee: number
  total: number
  onOrdered: () => void
}) {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState(user?.displayName ?? '')
  const [phone, setPhone] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery')
  const [location, setLocation] = useState<OrderLocation | null>(null)
  const [locating, setLocating] = useState(false)
  const [locationDenied, setLocationDenied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleShareLocation() {
    setLocating(true)
    setLocationDenied(false)
    const result = await getCurrentLocation()
    if (result) {
      setLocation(result)
    } else {
      setLocationDenied(true)
    }
    setLocating(false)
  }

  async function handleSubmit() {
    setFormError(null)

    if (!fullName.trim() || !phone.trim()) {
      setFormError('Please enter your name and phone number.')
      return
    }
    if (deliveryMethod === 'delivery') {
      if (!addressLine1.trim() || !city.trim() || !pincode.trim()) {
        setFormError('Please fill in your delivery address.')
        return
      }
      if (!isPincodeServiceable(pincode)) {
        setFormError('Sorry, we currently only deliver to Sultanpur (228001). Choose Store Pickup instead.')
        return
      }
    }

    setSubmitting(true)

    const finalDeliveryFee = deliveryMethod === 'pickup' ? 0 : deliveryFee
    const finalTotal = deliveryMethod === 'pickup' ? subtotal : total
    const orderItems = lineItems.map(({ item, product }) => ({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] ?? '',
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: getEffectivePrice(product),
    }))

    // Saving to Firestore is best-effort: the customer's actual goal is to
    // reach the store on WhatsApp, so a database hiccup (offline, rules,
    // etc.) must never block that — fall back to a locally-generated order
    // number and still open WhatsApp with the complete message.
    let orderNumber: string
    try {
      orderNumber = await placeOrder({
        userId: user?.uid ?? null,
        items: orderItems,
        address: {
          fullName,
          phone,
          line1: deliveryMethod === 'delivery' ? addressLine1 : '',
          city: deliveryMethod === 'delivery' ? city : '',
          pincode: deliveryMethod === 'delivery' ? pincode : '',
        },
        location,
        deliveryMethod,
        paymentMethod: 'whatsapp',
        subtotal,
        deliveryFee: finalDeliveryFee,
        total: finalTotal,
      })
    } catch {
      orderNumber = `KK${Math.floor(100000 + Math.random() * 900000)}`
    }

    const message = cartOrderMessage({
      orderNumber,
      items: orderItems,
      subtotal,
      deliveryFee: finalDeliveryFee,
      total: finalTotal,
      fullName,
      phone,
      deliveryMethod,
      addressLine1,
      city,
      pincode,
      location,
    })

    window.open(buildWhatsappUrl(message), '_blank', 'noopener,noreferrer')
    onOrdered()
    navigate('/order-confirmation', { state: { orderNumber } })
    setSubmitting(false)
  }

  if (!open) {
    return (
      <Button size="lg" onClick={() => setOpen(true)} variant="whatsapp">
        <MessageCircle size={18} /> Order on WhatsApp
      </Button>
    )
  }

  const inputClass =
    'h-11 rounded-lg border border-ink-900/15 px-3 text-sm w-full focus:outline-none focus:border-sage-500'

  return (
    <div className="rounded-card bg-cream-100/60 p-4 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-ink-900">Your Details</h3>

      <input
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className={inputClass}
      />
      <input
        placeholder="Phone Number"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={inputClass}
      />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setDeliveryMethod('delivery')}
          className={`flex items-center justify-center gap-1.5 h-10 rounded-lg border text-sm font-medium cursor-pointer ${
            deliveryMethod === 'delivery' ? 'border-ink-900 bg-ink-900 text-cream-50' : 'border-ink-900/15'
          }`}
        >
          <Truck size={15} /> Delivery
        </button>
        <button
          type="button"
          onClick={() => setDeliveryMethod('pickup')}
          className={`flex items-center justify-center gap-1.5 h-10 rounded-lg border text-sm font-medium cursor-pointer ${
            deliveryMethod === 'pickup' ? 'border-ink-900 bg-ink-900 text-cream-50' : 'border-ink-900/15'
          }`}
        >
          <Store size={15} /> Pickup
        </button>
      </div>

      {deliveryMethod === 'delivery' && (
        <>
          <input
            placeholder="Address"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className={inputClass}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Pincode"
              inputMode="numeric"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              className={inputClass}
            />
          </div>
          {pincode.length === 6 && !isPincodeServiceable(pincode) && (
            <p className="text-xs text-error-500">
              We currently only deliver to Sultanpur (228001). Choose Store Pickup instead.
            </p>
          )}
        </>
      )}

      <div>
        {location ? (
          <p className="flex items-center gap-1.5 text-xs text-sage-600">
            <CheckCircle2 size={14} /> Location shared — we'll use it to find you faster.
          </p>
        ) : (
          <button
            type="button"
            onClick={handleShareLocation}
            disabled={locating}
            className="flex items-center gap-1.5 text-xs font-medium text-ink-600 hover:text-sage-600 cursor-pointer disabled:opacity-60"
          >
            {locating ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
            {locating ? 'Getting your location...' : 'Share my current location (optional)'}
          </button>
        )}
        {locationDenied && (
          <p className="text-xs text-ink-400 mt-1">
            Couldn't access your location. You can still place the order without it.
          </p>
        )}
      </div>

      {formError && <p className="text-sm text-error-500">{formError}</p>}

      <div className="flex justify-between text-sm font-semibold pt-2 border-t border-ink-900/10">
        <span>Total</span>
        <span>{formatPrice(deliveryMethod === 'pickup' ? subtotal : total)}</span>
      </div>

      <Button
        size="lg"
        onClick={handleSubmit}
        disabled={submitting}
        variant="whatsapp"
      >
        <MessageCircle size={18} />
        {submitting ? 'Preparing order...' : 'Send Order on WhatsApp'}
      </Button>
    </div>
  )
}
