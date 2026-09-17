import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="relative bg-cream-100 overflow-hidden">
      <div className="container-page grid lg:grid-cols-2 items-center gap-8 py-10 sm:py-14 lg:py-20">
        <div className="flex flex-col gap-5 order-2 lg:order-1">
          <span className="inline-flex w-fit items-center rounded-full bg-terracotta-100 text-terracotta-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            New Season Collection
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink-900 leading-[1.05]">
            Everything Little Ones Love
          </h1>
          <p className="text-base sm:text-lg text-ink-600 max-w-md">
            Discover stylish clothing, comfortable footwear and exciting toys for every little
            adventure.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link
              to="/clothing"
              className="inline-flex items-center justify-center h-13 px-7 rounded-xl bg-terracotta-600 text-cream-50 text-base font-medium hover:bg-terracotta-700 transition-colors"
            >
              Shop Clothing
            </Link>
            <Link
              to="/toys"
              className="inline-flex items-center justify-center h-13 px-7 rounded-xl border border-ink-900/20 text-ink-900 text-base font-medium hover:border-ink-900/40 hover:bg-ink-900/[0.03] transition-colors"
            >
              Explore Toys
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2 aspect-[4/3] sm:aspect-[16/10] lg:aspect-square rounded-card overflow-hidden bg-cream-200">
          <video
            src="/videos/hero-clothing.mp4"
            poster="/videos/hero-clothing-poster.jpg"
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="Children's outfits displayed on wooden hangers"
          />
        </div>
      </div>
    </section>
  )
}
