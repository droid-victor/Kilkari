import clsx from 'clsx'

export function SizeSelector({
  sizes,
  selected,
  onSelect,
}: {
  sizes: string[]
  selected: string | null
  onSelect: (size: string) => void
}) {
  if (sizes.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onSelect(size)}
          aria-pressed={selected === size}
          className={clsx(
            'h-11 min-w-11 px-3 rounded-lg border text-sm font-medium cursor-pointer transition-colors',
            selected === size
              ? 'border-ink-900 bg-ink-900 text-cream-50'
              : 'border-ink-900/20 text-ink-900 hover:border-ink-900/50',
          )}
        >
          {size}
        </button>
      ))}
    </div>
  )
}
