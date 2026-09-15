import { Truck, RotateCcw, ShieldCheck, Store, Sparkles, MessageCircle, MapPin } from 'lucide-react'

const items = [
  { icon: Truck, label: 'Fast Delivery' },
  { icon: RotateCcw, label: 'Easy Returns' },
  { icon: ShieldCheck, label: 'Secure Payments' },
  { icon: Store, label: 'Store Pickup' },
  { icon: Sparkles, label: 'Quality Products' },
  { icon: MessageCircle, label: 'WhatsApp Support' },
  { icon: MapPin, label: 'Local Store' },
]

export function TrustSection() {
  return (
    <section className="container-page py-10 sm:py-14">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center text-center gap-2">
            <div className="h-12 w-12 rounded-full bg-sage-50 flex items-center justify-center text-sage-600">
              <Icon size={22} />
            </div>
            <span className="text-xs font-medium text-ink-800">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
