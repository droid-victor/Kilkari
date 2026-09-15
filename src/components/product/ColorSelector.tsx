import clsx from 'clsx'
import type { ProductVariantColor } from '@/types/product'

export function ColorSelector({
  colors,
  selected,
  onSelect,
}: {
  colors: ProductVariantColor[]
  selected: string | null
  onSelect: (name: string) => void
}) {
  if (colors.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2.5">
      {colors.map((color) => (
        <button
          key={color.name}
          type="button"
          onClick={() => onSelect(color.name)}
          aria-label={color.name}
          aria-pressed={selected === color.name}
          title={color.name}
          className={clsx(
            'h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-cream-50 cursor-pointer transition',
            selected === color.name ? 'ring-ink-900' : 'ring-transparent',
          )}
          style={{ backgroundColor: color.hex }}
        />
      ))}
    </div>
  )
}
