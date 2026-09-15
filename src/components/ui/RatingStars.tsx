import { Star } from 'lucide-react'
import clsx from 'clsx'

export function RatingStars({
  rating,
  size = 14,
  showValue = false,
  reviewCount,
}: {
  rating: number
  size?: number
  showValue?: boolean
  reviewCount?: number
}) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating)
          return (
            <Star
              key={i}
              size={size}
              className={clsx(filled ? 'fill-sun-500 text-sun-500' : 'fill-transparent text-ink-400/40')}
            />
          )
        })}
      </div>
      {showValue && <span className="text-sm font-medium text-ink-800">{rating.toFixed(1)}</span>}
      {reviewCount != null && (
        <span className="text-sm text-ink-400">({reviewCount.toLocaleString('en-IN')})</span>
      )}
    </div>
  )
}
