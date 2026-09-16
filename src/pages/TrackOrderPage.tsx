import { useState } from 'react'
import { Package, CheckCircle2, Truck, Home, Box } from 'lucide-react'
import type { Order, OrderStatus } from '@/types/product'
import { getOrderByNumberAndPhone } from '@/services/orderService'
import { Button } from '@/components/ui/Button'

const steps: { status: OrderStatus; label: string; icon: typeof Box }[] = [
  { status: 'placed', label: 'Placed', icon: Box },
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { status: 'packed', label: 'Packed', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: Home },
]

export function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [mobile, setMobile] = useState('')
  const [order, setOrder] = useState<Order | null | undefined>(undefined)
  const [searching, setSearching] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!orderNumber || !mobile) return
    setSearching(true)
    const result = await getOrderByNumberAndPhone(orderNumber.trim(), mobile.trim())
    setOrder(result)
    setSearching(false)
  }

  const currentStepIndex = order ? steps.findIndex((s) => s.status === order.status) : -1

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
        <Button type="submit" disabled={searching}>
          {searching ? 'Searching...' : 'Track'}
        </Button>
      </form>

      {order === null && (
        <p className="mt-6 text-sm text-error-500">
          We couldn't find an order with that number and mobile number. Please check and try again.
        </p>
      )}

      {order && (
        <div className="mt-10 flex items-center justify-between">
          {steps.map((step, i) => {
            const Icon = step.icon
            const active = i <= currentStepIndex
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
