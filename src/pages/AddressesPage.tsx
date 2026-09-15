import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function AddressesPage() {
  return (
    <div className="container-page py-10 max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-6">Saved Addresses</h1>
      <div className="flex flex-col items-center text-center gap-3 py-10 rounded-card bg-cream-100/60">
        <MapPin size={32} className="text-ink-400" />
        <p className="text-ink-600 text-sm">No saved addresses yet.</p>
        <Button size="sm">Add New Address</Button>
      </div>
    </div>
  )
}
