import { Link } from 'react-router-dom'
import { categoryTiles } from '@/constants/categories'
import { SectionHeader } from '@/components/home/SectionHeader'

export function ShopByCategory() {
  return (
    <section className="container-page py-10 sm:py-14">
      <SectionHeader title="Shop by Category" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {categoryTiles.map((cat) => (
          <Link
            key={cat.slug}
            to={cat.path}
            className="group relative aspect-[4/5] sm:aspect-square rounded-card overflow-hidden bg-cream-200"
          >
            <img
              src={cat.image}
              alt={cat.label}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 text-cream-50 font-display text-lg sm:text-xl font-semibold">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
