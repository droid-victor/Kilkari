import { MapPin, Phone, MessageCircle, Star, Clock } from 'lucide-react'
import { useStoreSettingsStore } from '@/store/storeSettingsStore'
import { googleReviews } from '@/services/reviewService'
import { storeGeneralInquiryUrl } from '@/services/whatsappService'
import { businessConfig } from '@/config/business'
import { StoreMap } from '@/components/store/StoreMap'

export function StorePage() {
  const storeConfig = useStoreSettingsStore((s) => s.settings)
  return (
    <div>
      <section className="container-page py-8 sm:py-12">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900">
          Visit Our Store
        </h1>
        <p className="text-ink-600 mt-2 max-w-xl">{storeConfig.description}</p>
      </section>

      <section className="container-page grid lg:grid-cols-2 gap-8 pb-10">
        <div className="aspect-video lg:aspect-auto rounded-card overflow-hidden bg-cream-200">
          <StoreMap className="h-full w-full min-h-72" />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink-900">{storeConfig.name}</h2>
            {storeConfig.rating != null && (
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex text-sun-500" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.round(storeConfig.rating!) ? 'fill-sun-500' : 'fill-transparent'}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{storeConfig.rating.toFixed(1)}</span>
                {storeConfig.reviewCount != null && (
                  <span className="text-sm text-ink-400">({storeConfig.reviewCount} Google reviews)</span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 text-sm text-ink-800">
            <MapPin size={18} className="shrink-0 mt-0.5 text-ink-400" />
            <span>{storeConfig.address}</span>
          </div>

          <div className="flex items-start gap-2 text-sm text-ink-800">
            <Phone size={18} className="shrink-0 mt-0.5 text-ink-400" />
            <a href={`tel:${storeConfig.phone}`} className="hover:text-terracotta-600">
              {storeConfig.phone}
            </a>
          </div>

          <div id="hours" className="flex items-start gap-2 text-sm text-ink-800">
            <Clock size={18} className="shrink-0 mt-0.5 text-ink-400" />
            <div className="flex flex-col gap-0.5">
              {storeConfig.openingHours.map((h) => (
                <span key={h.day}>
                  <span className="font-medium">{h.day}:</span> {h.hours}
                </span>
              ))}
            </div>
          </div>

          {storeConfig.nearbyLandmark && (
            <p className="text-sm text-ink-600">
              <span className="font-medium text-ink-800">Landmark:</span> {storeConfig.nearbyLandmark}
            </p>
          )}
          {storeConfig.parkingInfo && (
            <p className="text-sm text-ink-600">
              <span className="font-medium text-ink-800">Parking:</span> {storeConfig.parkingInfo}
            </p>
          )}

          <div className="flex flex-wrap gap-2.5 mt-2">
            <a
              href={storeConfig.googleDirectionsUrl || storeConfig.googleMapsUrl || storeConfig.googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-11 px-5 rounded-xl bg-ink-900 text-cream-50 text-sm font-medium hover:bg-ink-800"
            >
              <MapPin size={16} /> Get Directions
            </a>
            <a
              href={`tel:${storeConfig.phone}`}
              className="inline-flex items-center gap-1.5 h-11 px-5 rounded-xl border border-ink-900/20 text-sm font-medium hover:bg-ink-900/[0.03]"
            >
              <Phone size={16} /> Call Store
            </a>
            <a
              href={storeGeneralInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-11 px-5 rounded-xl border border-ink-900/20 text-sm font-medium hover:bg-ink-900/[0.03]"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="container-page py-10 border-t border-ink-900/8">
        <h2 className="font-display text-2xl font-semibold text-ink-900 mb-2">Why Visit Us</h2>
        <ul className="grid sm:grid-cols-2 gap-3 mt-4 text-sm text-ink-800">
          <li>Wide collection of kids clothing, footwear, toys and accessories</li>
          <li>Try before you buy — get the right fit every time</li>
          {businessConfig.storePickupEnabled && <li>Convenient order online, pick up in store</li>}
          <li>Friendly, personal assistance from our team</li>
          {businessConfig.whatsappOrderingEnabled && <li>WhatsApp support for quick queries</li>}
          <li>Easy exchanges at the store</li>
        </ul>
      </section>

      <section className="container-page py-10 border-t border-ink-900/8">
        <h2 className="font-display text-2xl font-semibold text-ink-900 mb-4">Google Reviews</h2>
        {googleReviews.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {googleReviews.map((r) => (
              <div key={r.id} className="rounded-card bg-cream-100/60 p-5">
                <p className="text-sm text-ink-800">&ldquo;{r.excerpt}&rdquo;</p>
                <p className="text-xs text-ink-400 mt-2">
                  {r.author} · {r.relativeDate}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-600">
            Review excerpts will appear here once sourced from our verified Google Business Profile.
          </p>
        )}
        {storeConfig.googleBusinessUrl && (
          <a
            href={storeConfig.googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm font-medium text-terracotta-600"
          >
            View on Google →
          </a>
        )}
      </section>

      <section className="container-page py-10 border-t border-ink-900/8">
        <p className="text-sm text-ink-600">
          Can't find what you're looking for online?{' '}
          <a href={`tel:${storeConfig.phone}`} className="text-terracotta-600 font-medium">
            Call
          </a>{' '}
          or{' '}
          <a href={storeGeneralInquiryUrl()} target="_blank" rel="noopener noreferrer" className="text-terracotta-600 font-medium">
            WhatsApp us
          </a>{' '}
          and we'll check our store inventory.
        </p>
      </section>

      {/* Sticky mobile actions */}
      <div
        className="lg:hidden fixed left-0 right-0 z-30 bg-cream-50 border-t border-ink-900/8 grid grid-cols-3 h-14"
        style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom))' }}
      >
        <a href={`tel:${storeConfig.phone}`} className="flex items-center justify-center gap-1.5 text-sm font-medium border-r border-ink-900/8">
          <Phone size={16} /> Call
        </a>
        <a
          href={storeGeneralInquiryUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-sm font-medium border-r border-ink-900/8"
        >
          <MessageCircle size={16} /> WhatsApp
        </a>
        <a
          href={storeConfig.googleDirectionsUrl || storeConfig.googleMapsUrl || storeConfig.googleBusinessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-sm font-medium"
        >
          <MapPin size={16} /> Directions
        </a>
      </div>
    </div>
  )
}
