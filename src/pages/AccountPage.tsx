import { Link } from 'react-router-dom'
import { Package, Heart, MapPin, Tag, RotateCcw, HelpCircle, LogOut, User } from 'lucide-react'

const sections = [
  { label: 'My Orders', path: '/orders', icon: Package },
  { label: 'Wishlist', path: '/wishlist', icon: Heart },
  { label: 'Addresses', path: '/addresses', icon: MapPin },
  { label: 'Coupons', path: '/account#coupons', icon: Tag },
  { label: 'Returns', path: '/returns', icon: RotateCcw },
  { label: 'Support', path: '/contact', icon: HelpCircle },
]

export function AccountPage() {
  return (
    <div className="container-page py-10 max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-14 w-14 rounded-full bg-terracotta-100 flex items-center justify-center text-terracotta-600">
          <User size={24} />
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-900">My Account</h1>
          <p className="text-sm text-ink-400">Sign in to manage your orders and preferences</p>
        </div>
      </div>

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
          className="flex items-center gap-3 px-4 py-4 text-left text-error-500 cursor-pointer min-h-11"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
