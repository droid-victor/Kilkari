import { Heart } from 'lucide-react'
import clsx from 'clsx'
import { useWishlistStore } from '@/store/wishlistStore'

export function WishlistButton({
  productId,
  className,
}: {
  productId: string
  className?: string
}) {
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(productId))
  const toggle = useWishlistStore((s) => s.toggle)

  return (
    <button
      type="button"
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={isWishlisted}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
      }}
      className={clsx(
        'flex items-center justify-center rounded-full bg-cream-50/90 shadow-soft backdrop-blur transition-transform active:scale-90 cursor-pointer',
        'h-9 w-9',
        className,
      )}
    >
      <Heart
        size={18}
        className={clsx(isWishlisted ? 'fill-terracotta-600 text-terracotta-600' : 'text-ink-800')}
      />
    </button>
  )
}
