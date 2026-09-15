import { Link } from 'react-router-dom'
import { ageTiles } from '@/constants/categories'
import { SectionHeader } from '@/components/home/SectionHeader'

export function ShopByAge() {
  return (
    <section className="container-page py-10 sm:py-14">
      <SectionHeader title="Shop by Age" />
      <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-1">
        {ageTiles.map((age) => (
          <Link
            key={age.value}
            to={`/shop?age=${age.value}`}
            className="group flex flex-col items-center gap-2 shrink-0 w-24 sm:w-28"
          >
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden bg-cream-200 ring-1 ring-ink-900/8">
              <img
                src={age.image}
                alt={age.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-ink-800 text-center">
              {age.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
