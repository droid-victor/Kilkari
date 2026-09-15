import { brandConfig } from '@/config/brand'
import { storeConfig } from '@/config/store'

export function AboutPage() {
  return (
    <div className="container-page py-10 max-w-3xl">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900 mb-6">
        About {brandConfig.name}
      </h1>

      <div className="flex flex-col gap-8 text-ink-800">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900 mb-2">Our Story</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            {/* EDITABLE PLACEHOLDER: replace with the store's real founding story */}
            {storeConfig.name} began as a neighbourhood shop with a simple idea — every child
            deserves clothing, footwear and toys that are comfortable, joyful and made to last.
            Add the real story of how the store started here.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900 mb-2">What We Offer</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            From everyday essentials to festive outfits, school shoes to soft toys, we curate a
            wide range of products for babies, boys and girls across every age.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900 mb-2">
            Why Parents Trust Us
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            {/* EDITABLE PLACEHOLDER: replace with real, verifiable claims */}
            Personal service, quality products and a genuine local presence — that's what keeps
            families coming back to {storeConfig.name}.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900 mb-2">Our Promise</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Whether you shop online or visit us in person, we're committed to helping you find
            exactly what your little one needs.
          </p>
        </section>
      </div>
    </div>
  )
}
