import clsx from 'clsx'
import type { ReactNode } from 'react'

type Tone = 'terracotta' | 'sage' | 'sun' | 'ink' | 'error'

const toneStyles: Record<Tone, string> = {
  terracotta: 'bg-terracotta-600 text-cream-50',
  sage: 'bg-sage-600 text-cream-50',
  sun: 'bg-sun-500 text-ink-900',
  ink: 'bg-ink-900 text-cream-50',
  error: 'bg-error-500 text-cream-50',
}

export function Badge({ tone = 'ink', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        toneStyles[tone],
      )}
    >
      {children}
    </span>
  )
}
