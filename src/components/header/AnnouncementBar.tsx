import { businessConfig } from '@/config/business'
import { formatPrice } from '@/utils/format'

export function AnnouncementBar() {
  return (
    <div className="bg-ink-900 text-cream-50 text-xs sm:text-sm">
      <div className="container-page flex items-center justify-center h-9 gap-1 text-center">
        <p className="truncate">
          Free Doorstep Delivery on Orders Above {formatPrice(businessConfig.freeShippingThreshold)} ·  WhatsApp us for quick help
        </p>
      </div>
    </div>
  )
}
