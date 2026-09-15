import { MapPin, Phone, MessageCircle, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { storeConfig } from '@/config/store'
import { storeGeneralInquiryUrl } from '@/services/whatsappService'
import { StoreMap } from '@/components/store/StoreMap'

export function StoreLocationCTA() {
  return (
    <section className="container-page py-10 sm:py-14">
      <div className="rounded-card bg-sage-50 p-6 sm:p-10 grid lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-cream-50 px-3 py-1 text-xs font-semibold text-sage-600">
            <MapPin size={14} /> Visit Our Store
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">
            {storeConfig.name}
          </h2>
          <p className="text-ink-600 text-sm sm:text-base">{storeConfig.address}</p>

          {storeConfig.rating != null && (
            <div className="flex items-center gap-2">
              <div className="flex text-sun-500" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.round(storeConfig.rating!) ? 'fill-sun-500' : 'fill-transparent'}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-ink-800">{storeConfig.rating.toFixed(1)}</span>
              {storeConfig.reviewCount != null && (
                <span className="text-sm text-ink-400">({storeConfig.reviewCount} reviews)</span>
              )}
            </div>
          )}

          <p className="text-sm text-ink-600 mt-1">
            Prefer to shop in person? Visit us and explore our complete collection.
          </p>

          <div className="flex flex-wrap gap-2.5 mt-2">
            {storeConfig.googleDirectionsUrl || storeConfig.googleMapsUrl ? (
              <a
                href={storeConfig.googleDirectionsUrl || storeConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-11 px-5 rounded-xl bg-ink-900 text-cream-50 text-sm font-medium hover:bg-ink-800"
              >
                <MapPin size={16} /> Get Directions
              </a>
            ) : (
              <Link
                to="/store"
                className="inline-flex items-center gap-1.5 h-11 px-5 rounded-xl bg-ink-900 text-cream-50 text-sm font-medium hover:bg-ink-800"
              >
                <MapPin size={16} /> View Store Details
              </Link>
            )}
            <a
              href={`tel:${storeConfig.phone}`}
              className="inline-flex items-center gap-1.5 h-11 px-5 rounded-xl border border-ink-900/20 text-ink-900 text-sm font-medium hover:bg-ink-900/[0.03]"
            >
              <Phone size={16} /> Call Store
            </a>
            <a
              href={storeGeneralInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-11 px-5 rounded-xl border border-ink-900/20 text-ink-900 text-sm font-medium hover:bg-ink-900/[0.03]"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="aspect-video lg:aspect-square rounded-card overflow-hidden bg-cream-200">
          <StoreMap className="h-full w-full" />
        </div>
      </div>
    </section>
  )
}
