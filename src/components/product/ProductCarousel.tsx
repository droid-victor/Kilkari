import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/types/product'
import { ProductCard } from '@/components/product/ProductCard'

export function ProductCarousel({ products }: { products: Product[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  function scrollBy(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: 'smooth' })
  }

  if (products.length === 0) return null

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-1"
      >
        {products.map((p) => (
          <div key={p.id} className="min-w-[46%] sm:min-w-[30%] lg:min-w-[22%] snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollBy(-320)}
        className="hidden lg:flex absolute -left-4 top-1/3 h-10 w-10 items-center justify-center rounded-full bg-cream-50 shadow-lifted cursor-pointer"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(320)}
        className="hidden lg:flex absolute -right-4 top-1/3 h-10 w-10 items-center justify-center rounded-full bg-cream-50 shadow-lifted cursor-pointer"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
