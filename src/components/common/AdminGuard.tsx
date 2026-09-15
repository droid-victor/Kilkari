import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore, isAdminUser } from '@/store/authStore'

export function AdminGuard({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  if (loading) {
    return <div className="container-page py-16 text-center text-sm text-ink-400">Loading...</div>
  }

  if (!isAdminUser(user)) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
