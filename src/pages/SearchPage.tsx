import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchIcon } from 'lucide-react'
import type { Product } from '@/types/product'
import { searchProducts } from '@/services/productService'
import { ProductGrid } from '@/components/product/ProductGrid'
import { SearchBar } from '@/components/header/SearchBar'

const popularSearches = ['party dress', 'school shoes', 'soft toys', 'New Born rompers', 'building blocks']

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [results, setResults] = useState<Product[] | null>(null)

  useEffect(() => {
    if (!query) {
      setResults(null)
      return
    }
    searchProducts(query).then(setResults)
  }, [query])

  return (
    <div className="container-page py-6 sm:py-10">
      <div className="max-w-lg mb-6">
        <SearchBar autoFocus={!query} />
      </div>

      {!query && (
        <div>
          <h2 className="text-sm font-semibold text-ink-900 mb-3">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <a
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full bg-cream-100 px-3.5 py-2 text-sm text-ink-800 hover:bg-cream-200"
              >
                {term}
              </a>
            ))}
          </div>
        </div>
      )}

      {query && results == null && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-card bg-cream-200 animate-pulse" />
          ))}
        </div>
      )}

      {query && results != null && results.length === 0 && (
        <div className="flex flex-col items-center text-center gap-3 py-16">
          <SearchIcon size={40} className="text-ink-400" />
          <h1 className="font-display text-xl font-semibold text-ink-900">
            We couldn't find anything matching "{query}"
          </h1>
          <p className="text-ink-600">Try a different search term or browse our categories.</p>
        </div>
      )}

      {query && results != null && results.length > 0 && (
        <>
          <p className="text-sm text-ink-600 mb-4">
            {results.length} results for "{query}"
          </p>
          <ProductGrid products={results} />
        </>
      )}
    </div>
  )
}
