import { useEffect, useMemo, useState } from 'react'
import { Tag, X } from 'lucide-react'
import type { Product, ProductCategory } from '@/types/product'
import { subscribeToProducts } from '@/services/inventoryService'
import { applySaleToProducts, clearSaleFromProducts } from '@/services/saleService'
import { isSaleActive, getSaleStatusLabel, getEffectivePrice } from '@/utils/sale'
import { isFirebaseConfigured } from '@/config/firebase'
import { formatPrice } from '@/utils/format'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const categoryOptions: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'footwear', label: 'Footwear' },
  { value: 'toys', label: 'Toys' },
  { value: 'accessories', label: 'Accessories' },
]

function fromDatetimeLocal(value: string): string | null {
  if (!value) return null
  return new Date(value).toISOString()
}

export function AdminSalesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [discountPercent, setDiscountPercent] = useState(20)
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [applying, setApplying] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToProducts((data) => {
      setProducts(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [products, categoryFilter, query])

  const activeOrScheduled = useMemo(
    () => products.filter((p) => p.sale && p.sale.discountPercent > 0),
    [products],
  )

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAllFiltered() {
    setSelectedIds(new Set(filtered.map((p) => p.id)))
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  async function handleApply() {
    if (selectedIds.size === 0 || discountPercent <= 0) return
    setApplying(true)
    setMessage(null)
    try {
      await applySaleToProducts([...selectedIds], {
        discountPercent,
        startsAt: fromDatetimeLocal(startsAt),
        endsAt: fromDatetimeLocal(endsAt),
      })
      setMessage(`Sale applied to ${selectedIds.size} product${selectedIds.size === 1 ? '' : 's'}.`)
      clearSelection()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to apply sale.')
    } finally {
      setApplying(false)
    }
  }

  async function handleRemoveSale(productId: string) {
    if (!confirm('Remove this sale? The product will return to its regular price.')) return
    await clearSaleFromProducts([productId])
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Sales & Discounts</h1>
        <p className="text-sm text-ink-400 mt-1">
          Apply a percentage discount (off MRP) to selected products, with an optional schedule.
        </p>
      </div>

      {!isFirebaseConfigured && (
        <div className="rounded-card bg-terracotta-50 text-terracotta-700 text-sm p-4">
          Firebase is not connected — sale management is disabled until <code>.env.local</code> is
          configured.
        </div>
      )}

      {/* Build a sale */}
      <div className="rounded-card bg-cream-50 p-5 shadow-soft flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-ink-900">1. Choose products</h2>
        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ProductCategory | 'all')}
            className="h-10 rounded-lg border border-ink-900/15 px-3 text-sm"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            className="h-10 flex-1 min-w-40 rounded-lg border border-ink-900/15 px-3 text-sm"
          />
          <Button type="button" variant="outline" size="sm" onClick={selectAllFiltered}>
            Select all ({filtered.length})
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={clearSelection}>
            Clear selection
          </Button>
        </div>

        <div className="max-h-72 overflow-y-auto rounded-lg border border-ink-900/8 divide-y divide-ink-900/8">
          {loading ? (
            <p className="p-4 text-sm text-ink-400">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="p-4 text-sm text-ink-400">No products match.</p>
          ) : (
            filtered.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-cream-100/60 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(p.id)}
                  onChange={() => toggleSelected(p.id)}
                  className="h-4 w-4"
                />
                <img
                  src={p.images[0]}
                  alt=""
                  className="h-8 w-8 rounded object-cover bg-cream-200 shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden'
                  }}
                />
                <span className="flex-1 min-w-0 truncate">{p.name}</span>
                <span className="text-ink-400 shrink-0">{formatPrice(p.mrp)}</span>
                {p.sale && p.sale.discountPercent > 0 && (
                  <Badge tone="terracotta">{getSaleStatusLabel(p)}</Badge>
                )}
              </label>
            ))
          )}
        </div>

        <h2 className="text-sm font-semibold text-ink-900 mt-2">2. Set the discount</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-ink-600 mb-1 block">Discount % (off MRP)</label>
            <input
              type="number"
              min={1}
              max={90}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-ink-900/15 px-3 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-600 mb-1 block">
              Starts at <span className="text-ink-400">(optional)</span>
            </label>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="h-10 w-full rounded-lg border border-ink-900/15 px-3 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-600 mb-1 block">
              Ends at <span className="text-ink-400">(optional)</span>
            </label>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="h-10 w-full rounded-lg border border-ink-900/15 px-3 text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-ink-400">
          Leave "Starts at" empty to begin immediately. Leave "Ends at" empty for no end date.
        </p>

        {message && <p className="text-sm text-sage-600">{message}</p>}

        <Button
          type="button"
          onClick={handleApply}
          disabled={!isFirebaseConfigured || applying || selectedIds.size === 0 || discountPercent <= 0}
          className="w-fit"
        >
          <Tag size={16} />
          {applying
            ? 'Applying...'
            : `Apply ${discountPercent}% off to ${selectedIds.size} product${selectedIds.size === 1 ? '' : 's'}`}
        </Button>
      </div>

      {/* Current sales */}
      <div className="rounded-card bg-cream-50 p-5 shadow-soft">
        <h2 className="text-sm font-semibold text-ink-900 mb-3">Active & Scheduled Sales</h2>
        {activeOrScheduled.length === 0 ? (
          <p className="text-sm text-ink-400">No products currently have a sale applied.</p>
        ) : (
          <div className="flex flex-col divide-y divide-ink-900/8">
            {activeOrScheduled.map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-2.5 text-sm">
                <img
                  src={p.images[0]}
                  alt=""
                  className="h-9 w-9 rounded object-cover bg-cream-200 shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden'
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-ink-900">{p.name}</p>
                  <p className="text-xs text-ink-400">
                    {p.sale!.discountPercent}% off &rarr; {formatPrice(getEffectivePrice(p))}
                    {p.sale!.startsAt && ` · from ${new Date(p.sale!.startsAt).toLocaleString()}`}
                    {p.sale!.endsAt && ` · until ${new Date(p.sale!.endsAt).toLocaleString()}`}
                  </p>
                </div>
                <Badge tone={isSaleActive(p) ? 'terracotta' : 'ink'}>{getSaleStatusLabel(p)}</Badge>
                <button
                  type="button"
                  aria-label={`Remove sale from ${p.name}`}
                  onClick={() => handleRemoveSale(p.id)}
                  disabled={!isFirebaseConfigured}
                  className="p-1.5 rounded-lg hover:bg-error-500/10 text-error-500 disabled:opacity-40 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
