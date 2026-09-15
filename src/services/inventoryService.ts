import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/config/firebase'
import { products as mockProducts } from '@/constants/products'
import type { Product } from '@/types/product'

const PRODUCTS_COLLECTION = 'products'

/**
 * Live product data source for the whole app.
 *
 * If Firebase isn't configured yet (no .env.local), this transparently
 * falls back to the bundled mock catalog so the storefront and dev
 * experience keep working. Once Firebase is configured and seeded
 * (see scripts/seedFirestore.ts), all reads/writes go through Firestore
 * and the admin panel becomes the single source of truth.
 */

export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  if (!isFirebaseConfigured) {
    callback(mockProducts)
    return () => {}
  }

  const unsubscribe = onSnapshot(
    collection(db, PRODUCTS_COLLECTION),
    (snapshot) => {
      const products = snapshot.docs.map((d) => d.data() as Product)
      callback(products.length > 0 ? products : mockProducts)
    },
    () => {
      // Firestore read failed (rules, offline, etc.) — fall back to mock data
      // rather than showing an empty storefront.
      callback(mockProducts)
    },
  )
  return unsubscribe
}

export async function fetchAllProductsOnce(): Promise<Product[]> {
  if (!isFirebaseConfigured) return mockProducts
  const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION))
  const products = snapshot.docs.map((d) => d.data() as Product)
  return products.length > 0 ? products : mockProducts
}

export async function saveProduct(product: Product): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add credentials to .env.local to save changes.')
  }
  await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), {
    ...product,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProduct(productId: string): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add credentials to .env.local to save changes.')
  }
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId))
}

export async function updateStock(
  productId: string,
  onlineStock: number,
  storeStock: number,
): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add credentials to .env.local to save changes.')
  }
  await setDoc(
    doc(db, PRODUCTS_COLLECTION, productId),
    { onlineStock, storeStock, pickupAvailable: storeStock > 0, updatedAt: serverTimestamp() },
    { merge: true },
  )
}
