import { Link } from 'react-router-dom'
import { genderTiles } from '@/constants/categories'

export function ShopByGender() {
  return (
    <section className="container-page py-10 sm:py-14">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {genderTiles.map((g) => (
          <Link
            key={g.value}
            to={g.path}
            className="group relative aspect-[16/9] sm:aspect-[3/4] rounded-card overflow-hidden bg-cream-200"
          >
            <img
              src={g.image}
              alt={g.label}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 flex flex-col gap-1">
              <span className="text-cream-50 font-display text-xl sm:text-2xl font-semibold">
                {g.label}
              </span>
              <span className="text-cream-50/90 text-xs font-medium underline underline-offset-2">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
