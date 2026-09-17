import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/config/firebase'
import { storeConfig as defaultStoreConfig, type OpeningHour } from '@/config/store'

const SETTINGS_DOC = 'settings/store'

export interface StoreSettings {
  name: string
  tagline: string
  description: string
  address: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  phone: string
  whatsapp: string
  email: string
  latitude: number | null
  longitude: number | null
  googleMapsUrl: string
  googleDirectionsUrl: string
  googleBusinessUrl: string
  rating: number | null
  reviewCount: number | null
  openingHours: OpeningHour[]
  parkingInfo: string
  nearbyLandmark: string
  socialLinks: {
    instagram: string
    facebook: string
    youtube: string
  }
}

const DEFAULT_OPENING_HOURS: OpeningHour[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
].map((day) => ({ day, hours: '9:00 AM - 9:00 PM' }))

export function getDefaultStoreSettings(): StoreSettings {
  return {
    name: defaultStoreConfig.name,
    tagline: defaultStoreConfig.tagline,
    description: defaultStoreConfig.description,
    address: defaultStoreConfig.address,
    addressLine1: defaultStoreConfig.addressLine1,
    addressLine2: defaultStoreConfig.addressLine2,
    city: defaultStoreConfig.city,
    state: defaultStoreConfig.state,
    pincode: defaultStoreConfig.pincode,
    phone: defaultStoreConfig.phone,
    whatsapp: defaultStoreConfig.whatsapp,
    email: defaultStoreConfig.email,
    latitude: defaultStoreConfig.latitude,
    longitude: defaultStoreConfig.longitude,
    googleMapsUrl: defaultStoreConfig.googleMapsUrl,
    googleDirectionsUrl: defaultStoreConfig.googleDirectionsUrl,
    googleBusinessUrl: defaultStoreConfig.googleBusinessUrl,
    rating: defaultStoreConfig.rating,
    reviewCount: defaultStoreConfig.reviewCount,
    openingHours: DEFAULT_OPENING_HOURS,
    parkingInfo: defaultStoreConfig.parkingInfo,
    nearbyLandmark: defaultStoreConfig.nearbyLandmark,
    socialLinks: { ...defaultStoreConfig.socialLinks },
  }
}

export function subscribeToStoreSettings(callback: (settings: StoreSettings) => void): () => void {
  const fallback = getDefaultStoreSettings()

  if (!isFirebaseConfigured) {
    callback(fallback)
    return () => {}
  }

  const [collection, id] = SETTINGS_DOC.split('/')
  const unsubscribe = onSnapshot(
    doc(db, collection, id),
    (snap) => {
      if (snap.exists()) {
        callback({ ...fallback, ...(snap.data() as Partial<StoreSettings>) })
      } else {
        callback(fallback)
      }
    },
    () => callback(fallback),
  )
  return unsubscribe
}

export async function fetchStoreSettingsOnce(): Promise<StoreSettings> {
  const fallback = getDefaultStoreSettings()
  if (!isFirebaseConfigured) return fallback
  const [collection, id] = SETTINGS_DOC.split('/')
  const snap = await getDoc(doc(db, collection, id))
  if (!snap.exists()) return fallback
  return { ...fallback, ...(snap.data() as Partial<StoreSettings>) }
}

export async function saveStoreSettings(settings: StoreSettings): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add credentials to .env.local to save changes.')
  }
  const [collection, id] = SETTINGS_DOC.split('/')
  await setDoc(doc(db, collection, id), settings)
}
