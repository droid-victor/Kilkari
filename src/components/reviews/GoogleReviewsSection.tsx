import { Star } from 'lucide-react'
import { storeConfig } from '@/config/store'
import { googleReviews } from '@/services/reviewService'
import { SectionHeader } from '@/components/home/SectionHeader'

export function GoogleReviewsSection() {
  return (
    <section className="container-page py-10 sm:py-14">
      <SectionHeader title="Loved by Parents" subtitle="Trusted by local families" />

      <div className="flex items-center gap-3 mb-6">
        {storeConfig.rating != null ? (
          <>
            <div className="flex text-sun-500" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.round(storeConfig.rating!) ? 'fill-sun-500' : 'fill-transparent'}
                />
              ))}
            </div>
            <span className="font-semibold text-ink-900">{storeConfig.rating.toFixed(1)}</span>
            {storeConfig.reviewCount != null && (
              <span className="text-sm text-ink-400">
                Based on {storeConfig.reviewCount} Google reviews
              </span>
            )}
          </>
        ) : (
          <span className="text-sm text-ink-400">
            Google rating will appear here once connected to our Business Profile.
          </span>
        )}
      </div>

      {googleReviews.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {googleReviews.map((review) => (
            <div key={review.id} className="rounded-card bg-cream-100/60 p-5 flex flex-col gap-2">
              <div className="flex text-sun-500" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < review.rating ? 'fill-sun-500' : 'fill-transparent'} />
                ))}
              </div>
              <p className="text-sm text-ink-800">&ldquo;{review.excerpt}&rdquo;</p>
              <span className="text-xs text-ink-400 mt-1">
                {review.author} · {review.relativeDate}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-card bg-cream-100/60 p-8 text-center text-sm text-ink-600">
          Customer review excerpts from Google will be shown here once sourced from our verified
          Business Profile.
        </div>
      )}

      {storeConfig.googleBusinessUrl && (
        <a
          href={storeConfig.googleBusinessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-5 text-sm font-medium text-terracotta-600 hover:text-terracotta-700"
        >
          Read more reviews on Google →
        </a>
      )}
    </section>
  )
}
