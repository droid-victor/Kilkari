import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import type { Order } from '@/types/product'
import { useAuthStore } from '@/store/authStore'
import { getOrdersForUser } from '@/services/orderService'
import { formatPrice } from '@/utils/format'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const statusLabels: Record<Order['status'], string> = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
}

export function OrdersPage() {
  const user = useAuthStore((s) => s.user)
  const authLoading = useAuthStore((s) => s.loading)
  const [orders, setOrders] = useState<Order[] | null>(null)

  useEffect(() => {
    if (!user) return
    getOrdersForUser(user.uid).then(setOrders)
  }, [user])

  if (authLoading) {
    return <div className="container-page py-16 text-center text-sm text-ink-400">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: '/orders' }} replace />
  }

  if (orders === null) {
    return <div className="container-page py-16 text-center text-sm text-ink-400">Loading orders...</div>
  }

  if (orders.length === 0) {
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

  return (
    <div className="container-page py-10 max-w-2xl">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 mb-6">My Orders</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-card bg-cream-100/60 p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-ink-900">#{order.orderNumber}</span>
              <Badge tone="sage">{statusLabels[order.status]}</Badge>
            </div>
            <p className="text-xs text-ink-400">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
            <div className="flex flex-col gap-1 mt-1">
              {order.items.map((item, i) => (
                <p key={i} className="text-sm text-ink-600">
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>
            <p className="text-sm font-semibold text-ink-900 mt-1">{formatPrice(order.total)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
