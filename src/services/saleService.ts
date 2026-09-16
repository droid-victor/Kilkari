import { doc, writeBatch, serverTimestamp } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/config/firebase'
import type { Product, ProductSale } from '@/types/product'

const PRODUCTS_COLLECTION = 'products'

export async function applySaleToProducts(
  productIds: string[],
  sale: ProductSale,
): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add credentials to .env.local to save changes.')
  }
  const batch = writeBatch(db)
  for (const id of productIds) {
    batch.set(doc(db, PRODUCTS_COLLECTION, id), { sale, updatedAt: serverTimestamp() }, { merge: true })
  }
  await batch.commit()
}

export async function clearSaleFromProducts(productIds: string[]): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add credentials to .env.local to save changes.')
  }
  const batch = writeBatch(db)
  for (const id of productIds) {
    batch.set(doc(db, PRODUCTS_COLLECTION, id), { sale: null, updatedAt: serverTimestamp() }, { merge: true })
  }
  await batch.commit()
}

export function productsWithAnySale(products: Product[]): Product[] {
  return products.filter((p) => p.sale && p.sale.discountPercent > 0)
}
