import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, AlertTriangle, Store, Globe } from 'lucide-react'
import type { Product } from '@/types/product'
import { getAllProducts } from '@/services/productService'
import { isFirebaseConfigured } from '@/config/firebase'

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-card bg-cream-50 p-5 flex items-center gap-4 shadow-soft">
      <div className="h-11 w-11 rounded-full bg-terracotta-50 text-terracotta-600 flex items-center justify-center shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-ink-900 tabular-nums">{value}</p>
        <p className="text-xs text-ink-400">{label}</p>
      </div>
    </div>
  )
}

export function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[] | null>(null)

  useEffect(() => {
    getAllProducts().then(setProducts)
  }, [])

  const totalProducts = products?.length ?? 0
  const outOfStock = products?.filter((p) => p.onlineStock + p.storeStock === 0).length ?? 0
  const onlineUnits = products?.reduce((sum, p) => sum + p.onlineStock, 0) ?? 0
  const storeUnits = products?.reduce((sum, p) => sum + p.storeStock, 0) ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-400 mt-1">Overview of your catalog and stock.</p>
      </div>

      {!isFirebaseConfigured && (
        <div className="rounded-card bg-terracotta-50 text-terracotta-700 text-sm p-4">
          Firebase is not connected yet — you're viewing read-only sample data. Add your Firebase
          project credentials to <code>.env.local</code> to enable saving changes here. See{' '}
          <code>.env.example</code> and <code>README.md</code> for setup steps.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value={totalProducts} />
        <StatCard icon={AlertTriangle} label="Out of Stock" value={outOfStock} />
        <StatCard icon={Globe} label="Online Units" value={onlineUnits} />
        <StatCard icon={Store} label="Store Units" value={storeUnits} />
      </div>

      <Link
        to="/admin/products"
        className="inline-flex w-fit items-center gap-2 h-11 px-5 rounded-xl bg-ink-900 text-cream-50 text-sm font-medium hover:bg-ink-800"
      >
        Manage Products & Inventory
      </Link>
    </div>
  )
}
