import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Heart, ShoppingBag, User, Menu, X, Search } from 'lucide-react'
import clsx from 'clsx'
import { AnnouncementBar } from '@/components/header/AnnouncementBar'
import { SearchBar } from '@/components/header/SearchBar'
import { Portal } from '@/components/common/Portal'
import { AnimatedLogo } from '@/components/common/AnimatedLogo'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { mainNavLinks } from '@/constants/navigation'
import { brandConfig } from '@/config/brand'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const cartCount = useCartStore((s) => s.itemCount())
  const wishlistCount = useWishlistStore((s) => s.items.length)
  useBodyScrollLock(mobileMenuOpen)

  return (
    <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur border-b border-ink-900/8">
      <AnnouncementBar />

      <div className="container-page flex items-center h-16 lg:h-20 gap-4">
        {/* Mobile menu trigger */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden -ml-1.5 p-2 cursor-pointer"
        >
          <Menu size={22} />
        </button>

        <Link to="/" className="shrink-0" aria-label={`${brandConfig.name} home`}>
          <AnimatedLogo alt={brandConfig.name} className="h-9 lg:h-11" />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 ml-4">
          {mainNavLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                clsx(
                  'text-sm font-medium transition-colors hover:text-terracotta-600',
                  isActive ? 'text-terracotta-600' : 'text-ink-800',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block flex-1 max-w-sm ml-auto">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1 ml-auto lg:ml-4">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setMobileSearchOpen((v) => !v)}
            className="lg:hidden p-2.5 cursor-pointer"
          >
            <Search size={20} />
          </button>

          <Link
            to="/account"
            aria-label="Account"
            className="hidden lg:flex p-2.5 hover:text-terracotta-600 cursor-pointer"
          >
            <User size={20} />
          </Link>

          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} items`}
            className="relative p-2.5 hover:text-terracotta-600 cursor-pointer"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta-600 px-1 text-[10px] font-semibold text-cream-50">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label={`Cart, ${cartCount} items`}
            className="relative p-2.5 hover:text-terracotta-600 cursor-pointer"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta-600 px-1 text-[10px] font-semibold text-cream-50">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="lg:hidden container-page pb-3">
          <SearchBar autoFocus />
        </div>
      )}

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <Portal>
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="fixed inset-0 bg-ink-900/40"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed left-0 top-0 bottom-0 w-[82%] max-w-xs bg-cream-50 shadow-lifted flex flex-col">
              <div className="flex items-center justify-between h-16 px-4 border-b border-ink-900/8 shrink-0">
                <AnimatedLogo alt={brandConfig.name} className="h-8" />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>
              <nav className="flex flex-col p-2 overflow-y-auto flex-1">
                {mainNavLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'px-3 py-3.5 text-base font-medium rounded-lg',
                        isActive ? 'text-terracotta-600 bg-terracotta-50' : 'text-ink-800',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/store"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-3.5 text-base font-medium rounded-lg text-ink-800"
                >
                  Visit Our Store
                </NavLink>
                <NavLink
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-3.5 text-base font-medium rounded-lg text-ink-800"
                >
                  Account
                </NavLink>
              </nav>
            </div>
          </div>
        </Portal>
      )}
    </header>
  )
}
