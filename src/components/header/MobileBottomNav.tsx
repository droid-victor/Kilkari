import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, Search, Heart, User } from 'lucide-react'
import clsx from 'clsx'
import { useWishlistStore } from '@/store/wishlistStore'

const items = [
  { label: 'Home', path: '/', Icon: Home },
  { label: 'Categories', path: '/shop', Icon: LayoutGrid },
  { label: 'Search', path: '/search', Icon: Search },
  { label: 'Wishlist', path: '/wishlist', Icon: Heart },
  { label: 'Account', path: '/account', Icon: User },
]

export function MobileBottomNav() {
  const wishlistCount = useWishlistStore((s) => s.items.length)

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-50 border-t border-ink-900/8 pb-[env(safe-area-inset-bottom)]"
      style={{ height: 'calc(4rem + env(safe-area-inset-bottom))' }}
      aria-label="Primary"
    >
      <div className="grid grid-cols-5 h-16">
        {items.map(({ label, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center gap-1 text-[11px] font-medium relative',
                isActive ? 'text-terracotta-600' : 'text-ink-600',
              )
            }
          >
            <span className="relative">
              <Icon size={22} />
              {label === 'Wishlist' && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta-600 px-1 text-[9px] font-semibold text-cream-50">
                  {wishlistCount}
                </span>
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
