import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Package, LayoutDashboard, LogOut, ExternalLink, Tag, Store } from 'lucide-react'
import clsx from 'clsx'
import { brandConfig } from '@/config/brand'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products & Inventory', path: '/admin/products', icon: Package, end: false },
  { label: 'Sales & Discounts', path: '/admin/sales', icon: Tag, end: false },
  { label: 'Store Settings', path: '/admin/store-settings', icon: Store, end: false },
]

export function AdminLayout() {
  const signOut = useAuthStore((s) => s.signOut)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-dvh flex bg-cream-100">
      <aside className="w-60 shrink-0 bg-ink-900 text-cream-50 flex flex-col hidden sm:flex">
        <div className="h-16 flex items-center px-5 border-b border-cream-50/10">
          <span className="font-display text-lg font-semibold">{brandConfig.wordmark} Admin</span>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium',
                  isActive ? 'bg-cream-50/10 text-cream-50' : 'text-cream-50/70 hover:bg-cream-50/5',
                )
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-cream-50/10 flex flex-col gap-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-cream-50/70 hover:bg-cream-50/5"
          >
            <ExternalLink size={18} /> View Storefront
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-cream-50/70 hover:bg-cream-50/5 cursor-pointer text-left"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-cream-50 border-b border-ink-900/8 flex items-center justify-between px-4 sm:px-6">
          <span className="font-display text-lg font-semibold sm:hidden">{brandConfig.wordmark} Admin</span>
          <span className="hidden sm:block text-sm text-ink-400">Signed in as {user?.email}</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="sm:hidden flex items-center gap-1.5 text-sm font-medium text-error-500 cursor-pointer"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </header>
        <nav className="sm:hidden flex overflow-x-auto no-scrollbar border-b border-ink-900/8 bg-cream-50">
          {navItems.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2',
                  isActive ? 'border-terracotta-600 text-terracotta-600' : 'border-transparent text-ink-600',
                )
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
