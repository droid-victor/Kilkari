import { Link, useNavigate } from 'react-router-dom'
import { Package, Heart, MapPin, RotateCcw, HelpCircle, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { isFirebaseConfigured } from '@/config/firebase'
import { Button } from '@/components/ui/Button'

const sections = [
  { label: 'My Orders', path: '/orders', icon: Package },
  { label: 'Wishlist', path: '/wishlist', icon: Heart },
  { label: 'Addresses', path: '/addresses', icon: MapPin },
  { label: 'Returns', path: '/returns', icon: RotateCcw },
  { label: 'Support', path: '/contact', icon: HelpCircle },
]

export function AccountPage() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const signOut = useAuthStore((s) => s.signOut)
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  if (loading) {
    return <div className="container-page py-16 text-center text-sm text-ink-400">Loading...</div>
  }

  if (!user) {
    return (
      <div className="container-page py-16 flex flex-col items-center text-center gap-3">
        <User size={40} className="text-ink-400" />
        <h1 className="font-display text-2xl font-semibold text-ink-900">You're not signed in</h1>
        <p className="text-ink-600">Sign in to view your orders, wishlist and saved details.</p>
        <div className="flex gap-3 mt-2">
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline">Create Account</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-10 max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-14 w-14 rounded-full bg-terracotta-100 flex items-center justify-center text-terracotta-600">
          <User size={24} />
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-900">
            {user.displayName ?? 'My Account'}
          </h1>
          <p className="text-sm text-ink-400">{user.email}</p>
        </div>
      </div>

      {!isFirebaseConfigured && (
        <div className="rounded-card bg-terracotta-50 text-terracotta-700 text-sm p-4 mb-4">
          The store's backend isn't connected — orders and saved data won't persist.
        </div>
      )}

      <div className="flex flex-col divide-y divide-ink-900/8 rounded-card bg-cream-100/60 overflow-hidden">
        {sections.map(({ label, path, icon: Icon }) => (
          <Link
            key={label}
            to={path}
            className="flex items-center gap-3 px-4 py-4 hover:bg-cream-100 min-h-11"
          >
            <Icon size={18} className="text-ink-600" />
            <span className="text-sm font-medium text-ink-900">{label}</span>
          </Link>
        ))}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-4 text-left text-error-500 cursor-pointer min-h-11"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
