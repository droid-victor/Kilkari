import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function OrdersPage() {
  return (
    <div className="container-page py-16 flex flex-col items-center text-center gap-3">
      <Package size={40} className="text-ink-400" />
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        You haven't placed any orders yet
      </h1>
      <p className="text-ink-600">Once you place an order, it will show up here.</p>
      <Link to="/shop">
        <Button className="mt-2">Start Shopping</Button>
      </Link>
    </div>
  )
}
