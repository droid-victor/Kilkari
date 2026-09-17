import { useStoreSettingsStore } from '@/store/storeSettingsStore'
import type { Product } from '@/types/product'

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

export function cartOrderMessage(
  items: { name: string; size: string; color: string; quantity: number; price: number }[],
  total: number,
): string {
  const lines = items.map(
    (i) => `- ${i.name} (Size: ${i.size}, Color: ${i.color}) x${i.quantity} — ₹${i.price}`,
  )
  return [
    `Hi, I would like to place an order:`,
    ...lines,
    ``,
    `Total: ₹${total}`,
    `Please confirm availability and delivery/pickup options.`,
  ].join('\n')
}

export function storeGeneralInquiryUrl(): string {
  const name = useStoreSettingsStore.getState().settings.name
  return buildWhatsappUrl(`Hi, I have a question about products at ${name}.`)
}
