import { useState } from 'react'
import { Package, CheckCircle2, Truck, Home, Box } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const steps = [
  { label: 'Placed', icon: Box },
  { label: 'Confirmed', icon: CheckCircle2 },
  { label: 'Packed', icon: Package },
  { label: 'Shipped', icon: Truck },
  { label: 'Delivered', icon: Home },
]

export function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [mobile, setMobile] = useState('')
  const [tracked, setTracked] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (orderNumber && mobile) setTracked(true)
  }

  return (
    <div className="container-page py-10 max-w-2xl">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 mb-6">
        Track Your Order
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Order Number"
          className="h-11 flex-1 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
        />
        <input
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobile Number"
          type="tel"
          className="h-11 flex-1 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
        />
        <Button type="submit">Track</Button>
      </form>

      {tracked && (
        <div className="mt-10 flex items-center justify-between">
          {steps.map((step, i) => {
            const Icon = step.icon
            const active = i <= 2
            return (
              <div key={step.label} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    active ? 'bg-sage-600 text-cream-50' : 'bg-cream-200 text-ink-400'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span className="text-xs font-medium text-center">{step.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
