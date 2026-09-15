import { create } from 'zustand'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/config/firebase'
import { adminConfig } from '@/config/admin'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  signIn: async (email, password) => {
    set({ error: null })
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      set({ error: 'Invalid email or password.' })
      throw new Error('sign-in-failed')
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth)
  },
}))

if (isFirebaseConfigured) {
  onAuthStateChanged(auth, (user) => {
    useAuthStore.setState({ user, loading: false })
  })
} else {
  useAuthStore.setState({ user: null, loading: false })
}

export function isAdminUser(user: User | null): boolean {
  if (!user || !adminConfig.ownerEmail) return false
  return user.email?.toLowerCase() === adminConfig.ownerEmail.toLowerCase()
}
