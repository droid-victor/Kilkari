import { Store, PackageCheck, PackageX } from 'lucide-react'
import type { Product } from '@/types/product'
import { storeConfig } from '@/config/store'

export function StoreAvailability({ product }: { product: Product }) {
  const availableAtStore = product.storeStock > 0
  const availableOnline = product.onlineStock > 0

  return (
    <div className="rounded-card bg-cream-100/60 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-ink-900">
        <Store size={16} /> Store &amp; Delivery Availability
      </div>

      <div className="flex items-start gap-2 text-sm">
        {availableOnline ? (
          <PackageCheck size={16} className="text-sage-600 shrink-0 mt-0.5" />
        ) : (
          <PackageX size={16} className="text-ink-400 shrink-0 mt-0.5" />
        )}
        <span className={availableOnline ? 'text-ink-800' : 'text-ink-400'}>
          {availableOnline ? 'In stock for online delivery' : 'Not available for online delivery'}
        </span>
      </div>

      <div className="flex items-start gap-2 text-sm">
        {availableAtStore ? (
          <PackageCheck size={16} className="text-sage-600 shrink-0 mt-0.5" />
        ) : (
          <PackageX size={16} className="text-ink-400 shrink-0 mt-0.5" />
        )}
        <span className={availableAtStore ? 'text-ink-800' : 'text-ink-400'}>
          {availableAtStore
            ? `Available for pickup at ${storeConfig.name}${product.pickupAvailable ? ' today' : ''}`
            : 'Currently unavailable at store'}
        </span>
      </div>
    </div>
  )
}
