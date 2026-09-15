import { useCallback } from 'react'
import { Hero } from '@/components/home/Hero'
import { StoreLocationCTA } from '@/components/store/StoreLocationCTA'
import { ShopByCategory } from '@/components/home/ShopByCategory'
import { ShopByAge } from '@/components/home/ShopByAge'
import { ShopByGender } from '@/components/home/ShopByGender'
import { ProductShowcaseSection } from '@/components/home/ProductShowcaseSection'
import { TrustSection } from '@/components/home/TrustSection'
import { GoogleReviewsSection } from '@/components/reviews/GoogleReviewsSection'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'
import {
  getNewArrivals,
  getBestSellers,
  getProductsByCategory,
} from '@/services/productService'

export function HomePage() {
  const fetchNewArrivals = useCallback(() => getNewArrivals(12), [])
  const fetchBestSellers = useCallback(() => getBestSellers(12), [])
  const fetchClothing = useCallback(() => getProductsByCategory('clothing'), [])
  const fetchFootwear = useCallback(() => getProductsByCategory('footwear'), [])
  const fetchToys = useCallback(() => getProductsByCategory('toys'), [])

  return (
    <>
      <Hero />
      <StoreLocationCTA />
      <ShopByCategory />
      <ShopByAge />
      <ProductShowcaseSection
        title="Fresh Arrivals"
        subtitle="Just landed — the newest additions to our collection"
        ctaLabel="View all"
        ctaPath="/shop?filter=new"
        fetcher={fetchNewArrivals}
      />
      <ProductShowcaseSection
        title="Parents' Favourites"
        subtitle="Our most-loved bestsellers"
        ctaLabel="View all"
        ctaPath="/shop?filter=bestseller"
        fetcher={fetchBestSellers}
      />
      <ShopByGender />
      <ProductShowcaseSection
        title="Clothing"
        ctaLabel="Shop all clothing"
        ctaPath="/clothing"
        fetcher={fetchClothing}
      />
      <ProductShowcaseSection
        title="Footwear"
        ctaLabel="Shop all footwear"
        ctaPath="/footwear"
        fetcher={fetchFootwear}
      />
      <ProductShowcaseSection
        title="Toys"
        ctaLabel="Shop all toys"
        ctaPath="/toys"
        fetcher={fetchToys}
      />
      <TrustSection />
      <GoogleReviewsSection />
      <NewsletterSignup />
    </>
  )
}
