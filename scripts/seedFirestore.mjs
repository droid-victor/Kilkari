// One-time script to load the starter catalog into Firestore.
//
// Usage:
//   1. Fill in .env.local with your Firebase project credentials.
//   2. Run: node --experimental-strip-types scripts/seedFirestore.mjs
//      (requires Node 22.6+; on older Node, run `npm run build` first and
//      adjust the import path below to the compiled products module)
//
// Safe to re-run: it overwrites each product document by id, it does not
// duplicate. Intended to run ONCE per project to give the admin panel and
// storefront real Firestore data instead of the bundled mock catalog.
// After seeding, manage everything from /admin.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function loadEnvLocal() {
  const envPath = path.resolve(__dirname, '../.env.local')
  try {
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const value = trimmed.slice(eq + 1).trim()
      if (!(key in process.env)) process.env[key] = value
    }
  } catch {
    console.error('Could not read .env.local — copy .env.example to .env.local and fill it in first.')
    process.exit(1)
  }
}

loadEnvLocal()

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Missing Firebase config in .env.local. See .env.example.')
  process.exit(1)
}

const { products } = await import('../src/constants/products.ts')

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

console.log(`Seeding ${products.length} products into Firestore project "${firebaseConfig.projectId}"...`)

for (const product of products) {
  await setDoc(doc(db, 'products', product.id), { ...product, updatedAt: serverTimestamp() })
  console.log(`  + ${product.id} ${product.name}`)
}

console.log('Done. Your storefront and /admin will now read/write this Firestore data.')
process.exit(0)
