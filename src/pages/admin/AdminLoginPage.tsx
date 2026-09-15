import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { brandConfig } from '@/config/brand'
import { isFirebaseConfigured } from '@/config/firebase'
import { useAuthStore, isAdminUser } from '@/store/authStore'
import { Button } from '@/components/ui/Button'

export function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const user = useAuthStore((s) => s.user)
  const error = useAuthStore((s) => s.error)
  const signIn = useAuthStore((s) => s.signIn)

  if (isAdminUser(user)) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await signIn(email, password)
    } catch {
      // error is surfaced via the auth store
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-cream-100 px-4">
      <div className="w-full max-w-sm rounded-card bg-cream-50 p-8 shadow-lifted">
        <h1 className="font-display text-2xl font-semibold text-ink-900 text-center">
          {brandConfig.wordmark} Admin
        </h1>
        <p className="text-sm text-ink-400 text-center mt-1 mb-6">Sign in to manage inventory</p>

        {!isFirebaseConfigured && (
          <div className="rounded-lg bg-terracotta-50 text-terracotta-700 text-xs p-3 mb-4">
            Firebase is not configured yet. Add credentials to <code>.env.local</code> (see{' '}
            <code>.env.example</code>) before signing in.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
          />
          {error && <p className="text-sm text-error-500">{error}</p>}
          <Button type="submit" size="lg" disabled={submitting || !isFirebaseConfigured}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
