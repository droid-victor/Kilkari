import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/config/firebase'
import type { Order, OrderItem, DeliveryMethod, PaymentMethod, OrderLocation } from '@/types/product'

const ORDERS_COLLECTION = 'orders'

function generateOrderNumber(): string {
  return `KK${Math.floor(100000 + Math.random() * 900000)}`
}

export async function placeOrder(input: {
  userId: string | null
  items: OrderItem[]
  address: Order['address']
  location?: OrderLocation | null
  deliveryMethod: DeliveryMethod
  paymentMethod: PaymentMethod
  subtotal: number
  deliveryFee: number
  total: number
}): Promise<string> {
  const orderNumber = generateOrderNumber()

  if (!isFirebaseConfigured) {
    // Demo fallback so checkout still "works" without a backend connected.
    return orderNumber
  }

  const ref = doc(collection(db, ORDERS_COLLECTION))
  await setDoc(ref, {
    orderNumber,
    userId: input.userId,
    items: input.items,
    address: input.address,
    location: input.location ?? null,
    deliveryMethod: input.deliveryMethod,
    paymentMethod: input.paymentMethod,
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    total: input.total,
    status: 'placed',
    createdAt: serverTimestamp(),
  })
  return orderNumber
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  if (!isFirebaseConfigured) return []
  const q = query(collection(db, ORDERS_COLLECTION), where('userId', '==', userId))
  const snapshot = await getDocs(q)
  const orders = snapshot.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      orderNumber: data.orderNumber,
      userId: data.userId,
      items: data.items,
      address: data.address,
      location: data.location ?? null,
      deliveryMethod: data.deliveryMethod,
      paymentMethod: data.paymentMethod,
      subtotal: data.subtotal,
      deliveryFee: data.deliveryFee,
      total: data.total,
      status: data.status,
      createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
    } satisfies Order
  })
  // Sorted client-side to avoid requiring a composite Firestore index for
  // this single query (where + orderBy on different fields).
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getOrderByNumberAndPhone(
  orderNumber: string,
  phone: string,
): Promise<Order | null> {
  if (!isFirebaseConfigured) return null
  const q = query(collection(db, ORDERS_COLLECTION), where('orderNumber', '==', orderNumber))
  const snapshot = await getDocs(q)
  const match = snapshot.docs.find((d) => d.data().address?.phone === phone)
  if (!match) return null
  const data = match.data()
  return {
    id: match.id,
    orderNumber: data.orderNumber,
    userId: data.userId,
    items: data.items,
    address: data.address,
    location: data.location ?? null,
    deliveryMethod: data.deliveryMethod,
    paymentMethod: data.paymentMethod,
    subtotal: data.subtotal,
    deliveryFee: data.deliveryFee,
    total: data.total,
    status: data.status,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  if (!isFirebaseConfigured) return null
  const snap = await getDoc(doc(db, ORDERS_COLLECTION, orderId))
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    id: snap.id,
    orderNumber: data.orderNumber,
    userId: data.userId,
    items: data.items,
    address: data.address,
    location: data.location ?? null,
    deliveryMethod: data.deliveryMethod,
    paymentMethod: data.paymentMethod,
    subtotal: data.subtotal,
    deliveryFee: data.deliveryFee,
    total: data.total,
    status: data.status,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
  }
}
