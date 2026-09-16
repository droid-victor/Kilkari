import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { isFirebaseConfigured } from '@/config/firebase'
import { Button } from '@/components/ui/Button'
import { brandConfig } from '@/config/brand'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const signIn = useAuthStore((s) => s.signIn)
  const error = useAuthStore((s) => s.error)
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await signIn(email, password)
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/account'
      navigate(redirectTo, { replace: true })
    } catch {
      // error surfaced via the auth store
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page py-12 sm:py-16 flex justify-center">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-ink-900 text-center">
          Sign in to {brandConfig.wordmark}
        </h1>
        <p className="text-sm text-ink-400 text-center mt-1 mb-6">
          Track orders, save favourites, and check out faster.
        </p>

        {!isFirebaseConfigured && (
          <div className="rounded-lg bg-terracotta-50 text-terracotta-700 text-xs p-3 mb-4">
            Accounts aren't available yet — the store's backend isn't connected.
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

        <p className="text-sm text-ink-600 text-center mt-5">
          New here?{' '}
          <Link to="/signup" className="text-terracotta-600 font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
