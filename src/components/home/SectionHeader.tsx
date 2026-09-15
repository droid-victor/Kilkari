import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function SectionHeader({
  title,
  subtitle,
  ctaLabel,
  ctaPath,
}: {
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaPath?: string
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5 sm:mb-7">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">{title}</h2>
        {subtitle && <p className="text-sm text-ink-600 mt-1">{subtitle}</p>}
      </div>
      {ctaLabel && ctaPath && (
        <Link
          to={ctaPath}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-terracotta-600 hover:text-terracotta-700 shrink-0"
        >
          {ctaLabel} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  )
}
