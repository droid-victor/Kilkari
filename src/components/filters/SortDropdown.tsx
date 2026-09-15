import clsx from 'clsx'
import { useFilterStore } from '@/store/filterStore'

const sortOptions: { value: ReturnType<typeof useFilterStore.getState>['sortBy']; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'discount', label: 'Discount' },
]

export function SortDropdown({ className }: { className?: string }) {
  const sortBy = useFilterStore((s) => s.sortBy)
  const setSortBy = useFilterStore((s) => s.setSortBy)

  return (
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
      aria-label="Sort products"
      className={clsx(
        'h-11 w-full max-w-full min-w-0 rounded-lg border border-ink-900/15 bg-cream-50 px-3 text-sm text-ink-900 focus:outline-none focus:border-terracotta-500',
        className,
      )}
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          Sort: {opt.label}
        </option>
      ))}
    </select>
  )
}
