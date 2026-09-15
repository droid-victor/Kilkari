import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

/**
 * FIREBASE CONFIGURATION
 *
 * Reads from environment variables (see .env.example). Copy .env.example to
 * .env.local and fill in real values from your Firebase project:
 *   console.firebase.google.com -> Project Settings -> General -> Your apps
 *
 * Required Firebase setup:
 *   1. Create a Firebase project.
 *   2. Enable Firestore Database (production mode).
 *   3. Enable Authentication -> Sign-in method -> Email/Password.
 *   4. Create one user (the store owner) under Authentication -> Users.
 *   5. Set VITE_ADMIN_EMAIL in .env.local to that user's email.
 *   6. Deploy the security rules in firestore.rules (see project root).
 */

const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
}

export const isFirebaseConfigured = Boolean(
  envConfig.apiKey && envConfig.projectId && envConfig.appId,
)

// Firebase SDKs validate config eagerly (getAuth throws synchronously on a
// malformed/empty API key), which would crash the entire app before any
// component renders. When not configured, initialize with syntactically
// valid placeholder values instead — isFirebaseConfigured gates every real
// read/write, so these placeholders are never actually used to talk to a
// backend, they just keep the SDK from throwing during module load.
const firebaseConfig = isFirebaseConfigured
  ? envConfig
  : {
      apiKey: 'placeholder-api-key-not-configured',
      authDomain: 'placeholder.firebaseapp.com',
      projectId: 'placeholder-project',
      storageBucket: 'placeholder-project.appspot.com',
      messagingSenderId: '000000000000',
      appId: '1:000000000000:web:0000000000000000000000',
    }

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
