import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/config/firebase'
import type { CustomerProfile } from '@/types/product'

const CUSTOMERS_COLLECTION = 'customers'

export async function createCustomerProfile(
  uid: string,
  data: { name: string; email: string },
): Promise<void> {
  if (!isFirebaseConfigured) return
  await setDoc(doc(db, CUSTOMERS_COLLECTION, uid), {
    uid,
    name: data.name,
    email: data.email,
    createdAt: serverTimestamp(),
  })
}

export async function getCustomerProfile(uid: string): Promise<CustomerProfile | null> {
  if (!isFirebaseConfigured) return null
  const snap = await getDoc(doc(db, CUSTOMERS_COLLECTION, uid))
  if (!snap.exists()) return null
  return snap.data() as CustomerProfile
}
