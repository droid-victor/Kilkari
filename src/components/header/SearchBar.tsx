import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import clsx from 'clsx'

export function SearchBar({ className, autoFocus }: { className?: string; autoFocus?: boolean }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={clsx('relative', className)} role="search">
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
        aria-hidden="true"
      />
      <input
        type="search"
        value={query}
        autoFocus={autoFocus}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search clothes, shoes, toys..."
        aria-label="Search products"
        className="w-full h-11 rounded-full bg-cream-100 border border-ink-900/10 pl-10 pr-4 text-sm placeholder:text-ink-400 focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
      />
    </form>
  )
}
