import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { isFirebaseConfigured } from '@/config/firebase'
import { Button } from '@/components/ui/Button'
import { brandConfig } from '@/config/brand'

export function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const signUp = useAuthStore((s) => s.signUp)
  const error = useAuthStore((s) => s.error)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await signUp(name, email, password)
      navigate('/account', { replace: true })
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
          Create your {brandConfig.wordmark} account
        </h1>
        <p className="text-sm text-ink-400 text-center mt-1 mb-6">
          Save your details for faster checkout next time.
        </p>

        {!isFirebaseConfigured && (
          <div className="rounded-lg bg-terracotta-50 text-terracotta-700 text-xs p-3 mb-4">
            Accounts aren't available yet — the store's backend isn't connected.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            required
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
          />
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
            minLength={6}
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
          />
          {error && <p className="text-sm text-error-500">{error}</p>}
          <Button type="submit" size="lg" disabled={submitting || !isFirebaseConfigured}>
            {submitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-sm text-ink-600 text-center mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-terracotta-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
