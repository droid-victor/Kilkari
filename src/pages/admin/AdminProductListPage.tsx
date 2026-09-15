import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import type { Product } from '@/types/product'
import { subscribeToProducts, deleteProduct, updateStock } from '@/services/inventoryService'
import { isFirebaseConfigured } from '@/config/firebase'
import { formatPrice } from '@/utils/format'
import { Button } from '@/components/ui/Button'

export function AdminProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToProducts((data) => {
      setProducts(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase()),
  )

  async function handleStockChange(product: Product, field: 'onlineStock' | 'storeStock', value: number) {
    if (!isFirebaseConfigured) return
    setSavingId(product.id)
    const onlineStock = field === 'onlineStock' ? value : product.onlineStock
    const storeStock = field === 'storeStock' ? value : product.storeStock
    try {
      await updateStock(product.id, onlineStock, storeStock)
    } finally {
      setSavingId(null)
    }
  }

  async function handleDelete(product: Product) {
    if (!isFirebaseConfigured) return
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    await deleteProduct(product.id)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Products & Inventory</h1>
          <p className="text-sm text-ink-400 mt-1">{products.length} products</p>
        </div>
        <Link to="/admin/products/new">
          <Button>
            <Plus size={18} /> Add Product
          </Button>
        </Link>
      </div>

      {!isFirebaseConfigured && (
        <div className="rounded-card bg-terracotta-50 text-terracotta-700 text-sm p-4">
          Firebase is not connected — this list shows sample data and editing is disabled. Configure{' '}
          <code>.env.local</code> to manage real inventory.
        </div>
      )}

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or SKU"
          className="h-10 w-full rounded-lg border border-ink-900/15 pl-9 pr-3 text-sm focus:outline-none focus:border-terracotta-500"
        />
      </div>

      <div className="overflow-x-auto rounded-card bg-cream-50 shadow-soft">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left border-b border-ink-900/8 text-ink-400 text-xs uppercase tracking-wide">
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Online Stock</th>
              <th className="p-3">Store Stock</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-ink-400">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-ink-400">
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="border-b border-ink-900/8 last:border-0">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover bg-cream-200 shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.visibility = 'hidden'
                        }}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-ink-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-ink-400">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 capitalize text-ink-600">{product.category}</td>
                  <td className="p-3 tabular-nums">{formatPrice(product.price)}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min={0}
                      defaultValue={product.onlineStock}
                      disabled={!isFirebaseConfigured || savingId === product.id}
                      onBlur={(e) => handleStockChange(product, 'onlineStock', Number(e.target.value))}
                      className="w-20 h-9 rounded-lg border border-ink-900/15 px-2 text-sm tabular-nums disabled:opacity-50"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min={0}
                      defaultValue={product.storeStock}
                      disabled={!isFirebaseConfigured || savingId === product.id}
                      onBlur={(e) => handleStockChange(product, 'storeStock', Number(e.target.value))}
                      className="w-20 h-9 rounded-lg border border-ink-900/15 px-2 text-sm tabular-nums disabled:opacity-50"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/admin/products/${product.id}`}
                        aria-label={`Edit ${product.name}`}
                        className="p-2 rounded-lg hover:bg-ink-900/5 text-ink-600"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Delete ${product.name}`}
                        disabled={!isFirebaseConfigured}
                        onClick={() => handleDelete(product)}
                        className="p-2 rounded-lg hover:bg-error-500/10 text-error-500 disabled:opacity-40 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
