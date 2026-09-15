import { storeConfig } from '@/config/store'

export function StoreMap({ className }: { className?: string }) {
  const hasCoordinates = storeConfig.latitude != null && storeConfig.longitude != null
  const mapEmbedUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${storeConfig.latitude},${storeConfig.longitude}&z=16&output=embed`
    : null

  if (!mapEmbedUrl) {
    return (
      <div className={`flex items-center justify-center text-sm text-ink-400 p-6 text-center ${className ?? ''}`}>
        Map will appear here once store coordinates are added to config/store.ts
      </div>
    )
  }

  return (
    <iframe
      title={`${storeConfig.name} location map`}
      src={mapEmbedUrl}
      className={`border-0 ${className ?? ''}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  )
}
