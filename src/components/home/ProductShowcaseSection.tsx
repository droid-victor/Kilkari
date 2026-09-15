import { useEffect, useState } from 'react'
import type { Product } from '@/types/product'
import { SectionHeader } from '@/components/home/SectionHeader'
import { ProductCarousel } from '@/components/product/ProductCarousel'

export function ProductShowcaseSection({
  title,
  subtitle,
  ctaLabel,
  ctaPath,
  fetcher,
}: {
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaPath?: string
  fetcher: () => Promise<Product[]>
}) {
  const [products, setProducts] = useState<Product[] | null>(null)

  useEffect(() => {
    let active = true
    fetcher().then((data) => {
      if (active) setProducts(data)
    })
    return () => {
      active = false
    }
  }, [fetcher])

  if (products != null && products.length === 0) return null

  return (
    <section className="container-page py-10 sm:py-14">
      <SectionHeader title={title} subtitle={subtitle} ctaLabel={ctaLabel} ctaPath={ctaPath} />
      {products == null ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[46%] sm:min-w-[30%] lg:min-w-[22%] aspect-square rounded-card bg-cream-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <ProductCarousel products={products} />
      )}
    </section>
  )
}
