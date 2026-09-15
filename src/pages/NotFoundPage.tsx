import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="container-page py-24 flex flex-col items-center text-center gap-3">
      <span className="font-display text-6xl font-semibold text-terracotta-600">404</span>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Page not found</h1>
      <p className="text-ink-600">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/">
        <Button className="mt-2">Back to Home</Button>
      </Link>
    </div>
  )
}
