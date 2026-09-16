import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import type { Product, ProductCategory, Gender } from '@/types/product'
import { getAllProducts, applyFilters } from '@/services/productService'
import { useFilterStore } from '@/store/filterStore'
import { isSaleActive } from '@/utils/sale'
import { ProductGrid } from '@/components/product/ProductGrid'
import { FilterPanelContent } from '@/components/filters/FilterPanelContent'
import { FilterDrawer } from '@/components/filters/FilterDrawer'
import { SortDropdown } from '@/components/filters/SortDropdown'

interface ShopPageProps {
  title: string
  description?: string
  category?: ProductCategory
  gender?: Gender
  saleOnly?: boolean
}

export function ShopPage({ title, description, category, gender, saleOnly }: ShopPageProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const filters = useFilterStore()

  useEffect(() => {
    setLoading(true)
    getAllProducts().then((data) => {
      setAllProducts(data)
      setLoading(false)
    })
  }, [])

  const baseFiltered = useMemo(() => {
    let list = allProducts
    if (category) list = list.filter((p) => p.category === category)
    if (gender) list = list.filter((p) => p.gender === gender || p.gender === 'unisex')
    if (saleOnly) list = list.filter((p) => p.mrp > p.price || isSaleActive(p))

    const filterParam = searchParams.get('filter')
    if (filterParam === 'new') list = list.filter((p) => p.newArrival)
    if (filterParam === 'bestseller') list = list.filter((p) => p.bestSeller)

    const ageParam = searchParams.get('age')
    if (ageParam) list = list.filter((p) => p.ageGroup.includes(ageParam as never))

    return list
  }, [allProducts, category, gender, saleOnly, searchParams])

  const results = useMemo(() => applyFilters(baseFiltered, filters), [baseFiltered, filters])

  return (
    <div className="container-page py-6 sm:py-10 pb-24 lg:pb-10">
      <nav aria-label="Breadcrumb" className="text-xs text-ink-400 mb-2">
        <ol className="flex items-center gap-1">
          <li>Home</li>
          <li aria-hidden="true">/</li>
          <li className="text-ink-800">{title}</li>
        </ol>
      </nav>

      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">{title}</h1>
          {description && <p className="text-sm text-ink-600 mt-1 max-w-xl">{description}</p>}
          {!loading && <p className="text-xs text-ink-400 mt-1">{results.length} products</p>}
        </div>
        <div className="hidden lg:block">
          <SortDropdown />
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block">
          <FilterPanelContent />
        </aside>

        <div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-card bg-cream-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <ProductGrid products={results} />
          )}
        </div>
      </div>

      {/* Sticky mobile filter/sort bar */}
      <div
        className="lg:hidden fixed left-0 right-0 z-30 bg-cream-50 border-t border-ink-900/8 grid grid-cols-2 gap-2 px-3 py-2"
        style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex items-center justify-center gap-2 h-11 rounded-lg border border-ink-900/15 text-sm font-medium cursor-pointer"
        >
          <SlidersHorizontal size={16} /> Filter
        </button>
        <SortDropdown className="min-w-0 truncate" />
      </div>

      <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} resultCount={results.length} />
    </div>
  )
}
