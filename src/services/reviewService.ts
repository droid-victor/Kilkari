/**
 * GOOGLE REVIEW DATA LAYER
 *
 * IMPORTANT: Do not fabricate reviews. The entries below are placeholders
 * only, clearly marked, until real excerpts are sourced from the store's
 * Google Business Profile (see config/store.ts googleBusinessUrl) via an
 * approved method (Google Business Profile API, or manually copied short
 * excerpts with attribution and owner permission).
 */

export interface GoogleReview {
  id: string
  author: string
  rating: number
  excerpt: string
  relativeDate: string
  isPlaceholder: boolean
}

export const googleReviews: GoogleReview[] = []

export function hasVerifiedReviews(): boolean {
  return googleReviews.some((r) => !r.isPlaceholder)
}
