import type { Product } from '@/types/product'

/**
 * Sale semantics: a sale applies `discountPercent` off `mrp` (not off the
 * regular `price`), and is only in effect while `now` falls within
 * [startsAt, endsAt] — either bound may be null for "no limit". This keeps
 * the product's regular `price`/`mrp` untouched as the source of truth, so
 * a sale can be scheduled, previewed, and reverted without losing data.
 */

export function isSaleActive(product: Product, now: Date = new Date()): boolean {
  const sale = product.sale
  if (!sale) return false
  if (sale.discountPercent <= 0) return false
  const time = now.getTime()
  if (sale.startsAt && time < new Date(sale.startsAt).getTime()) return false
  if (sale.endsAt && time > new Date(sale.endsAt).getTime()) return false
  return true
}

/** The price to actually charge/display right now. */
export function getEffectivePrice(product: Product, now: Date = new Date()): number {
  if (isSaleActive(product, now)) {
    const discounted = Math.round(product.mrp * (1 - product.sale!.discountPercent / 100))
    return Math.max(0, discounted)
  }
  return product.price
}

export function getSaleStatusLabel(product: Product, now: Date = new Date()): string | null {
  const sale = product.sale
  if (!sale || sale.discountPercent <= 0) return null
  const time = now.getTime()
  if (sale.startsAt && time < new Date(sale.startsAt).getTime()) return 'Scheduled'
  if (sale.endsAt && time > new Date(sale.endsAt).getTime()) return 'Ended'
  return 'Active'
}
