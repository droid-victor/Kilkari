import { Link, useLocation, Navigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function OrderConfirmationPage() {
  const location = useLocation()
  const orderNumber = (location.state as { orderNumber?: string } | null)?.orderNumber

  if (!orderNumber) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="container-page py-16 flex flex-col items-center text-center gap-3">
      <CheckCircle2 size={48} className="text-sage-600" />
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">
        Order Placed Successfully!
      </h1>
      <p className="text-ink-600">
        Your order <span className="font-semibold text-ink-900">#{orderNumber}</span> has been
        confirmed. We'll send updates as it's packed and shipped.
      </p>
      <div className="flex gap-3 mt-3">
        <Link to="/track-order">
          <Button variant="outline">Track Order</Button>
        </Link>
        <Link to="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}
