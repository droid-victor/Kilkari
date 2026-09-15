import { formatPrice, calculateDiscountPercent } from '@/utils/format'

export function ProductPrice({
  price,
  mrp,
  size = 'md',
}: {
  price: number
  mrp: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const discount = calculateDiscountPercent(price, mrp)
  const priceClass = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-base'
  const mrpClass = size === 'lg' ? 'text-base' : 'text-xs'

  return (
    <div className="flex items-center gap-2 flex-wrap tabular-nums">
      <span className={`font-semibold text-ink-900 ${priceClass}`}>{formatPrice(price)}</span>
      {discount > 0 && (
        <>
          <span className={`text-ink-400 line-through ${mrpClass}`}>{formatPrice(mrp)}</span>
          <span className="text-xs font-semibold text-sage-600">{discount}% OFF</span>
        </>
      )}
    </div>
  )
}
