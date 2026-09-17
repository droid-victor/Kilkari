import { useStoreSettingsStore } from '@/store/storeSettingsStore'
import type { DeliveryMethod, OrderLocation, Product } from '@/types/product'
import { formatPrice } from '@/utils/format'

function toWhatsappNumber(raw: string): string {
  return raw.replace(/[^\d]/g, '')
}

export function buildWhatsappUrl(message: string): string {
  const number = toWhatsappNumber(useStoreSettingsStore.getState().settings.whatsapp)
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${number}?text=${encoded}`
}

export function productInquiryMessage(product: Product, size?: string): string {
  const sizePart = size ? ` Is size ${size} available?` : ' Is it available?'
  return `Hi, I am interested in ${product.name}.${sizePart}`
}

export interface WhatsappOrderItem {
  name: string
  size: string
  color: string
  quantity: number
  price: number
}

export interface WhatsappOrderDetails {
  orderNumber: string
  items: WhatsappOrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  fullName: string
  phone: string
  deliveryMethod: DeliveryMethod
  addressLine1?: string
  city?: string
  pincode?: string
  location?: OrderLocation | null
}

export function cartOrderMessage(details: WhatsappOrderDetails): string {
  const lines = details.items.map(
    (i) =>
      `- ${i.name} (Size: ${i.size}, Color: ${i.color}) x${i.quantity} — ${formatPrice(i.price * i.quantity)}`,
  )

  const parts = [
    `Hi, I'd like to place an order #${details.orderNumber}:`,
    ``,
    ...lines,
    ``,
    `Subtotal: ${formatPrice(details.subtotal)}`,
    `Delivery: ${details.deliveryFee === 0 ? 'FREE' : formatPrice(details.deliveryFee)}`,
    `Total: ${formatPrice(details.total)}`,
    ``,
    `Name: ${details.fullName}`,
    `Phone: ${details.phone}`,
    `Method: ${details.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery'}`,
  ]

  if (details.deliveryMethod === 'delivery') {
    parts.push(`Address: ${details.addressLine1}, ${details.city} - ${details.pincode}`)
  }

  if (details.location) {
    parts.push(
      `Location: https://www.google.com/maps?q=${details.location.latitude},${details.location.longitude}`,
    )
  }

  parts.push(``, `Please confirm availability and expected delivery/pickup time.`)

  return parts.join('\n')
}

export function storeGeneralInquiryUrl(): string {
  const name = useStoreSettingsStore.getState().settings.name
  return buildWhatsappUrl(`Hi, I have a question about products at ${name}.`)
}
