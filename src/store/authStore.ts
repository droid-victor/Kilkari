import { create } from 'zustand'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/config/firebase'
import { adminConfig } from '@/config/admin'
import { createCustomerProfile } from '@/services/customerService'

function authErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? ''
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
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
    } catch (err) {
      set({ error: authErrorMessage(err) })
      throw new Error('sign-in-failed')
    }
  },

  signUp: async (name, email, password) => {
    set({ error: null })
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credential.user, { displayName: name })
      await createCustomerProfile(credential.user.uid, { name, email })
    } catch (err) {
      set({ error: authErrorMessage(err) })
      throw new Error('sign-up-failed')
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
