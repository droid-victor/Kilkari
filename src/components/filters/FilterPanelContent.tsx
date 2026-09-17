import { useFilterStore } from '@/store/filterStore'
import type { AgeGroup, Gender } from '@/types/product'

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'boys', label: 'Boys' },
  { value: 'girls', label: 'Girls' },
  { value: 'New Born', label: 'New Born' },
  { value: 'unisex', label: 'Unisex' },
]

const ageOptions: { value: AgeGroup; label: string }[] = [
  { value: '0-3m', label: '0-3 Months' },
  { value: '3-12m', label: '3-12 Months' },
  { value: '1-3y', label: '1-3 Years' },
  { value: '4-7y', label: '4-7 Years' },
  { value: '8-12y', label: '8-12 Years' },
  { value: '13-16y', label: '13-16 Years' },
]

const priceRanges = [
  { label: 'Under ₹299', min: 0, max: 299 },
  { label: '₹299 - ₹499', min: 299, max: 499 },
  { label: '₹499 - ₹999', min: 499, max: 999 },
  { label: '₹999 - ₹1999', min: 999, max: 1999 },
  { label: 'Above ₹1999', min: 1999, max: null },
]

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-4 border-b border-ink-900/8">
      <h3 className="text-sm font-semibold text-ink-900 mb-3">{title}</h3>
      {children}
    </div>
  )
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer text-sm text-ink-800 min-h-11">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-ink-900/30 text-terracotta-600 focus:ring-terracotta-500"
      />
      {label}
    </label>
  )
}

export function FilterPanelContent() {
  const filters = useFilterStore()

  return (
    <div>
      <FilterGroup title="Gender">
        {genderOptions.map((opt) => (
          <Checkbox
            key={opt.value}
            checked={filters.genders.includes(opt.value)}
            onChange={() => filters.toggleGender(opt.value)}
            label={opt.label}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Age">
        {ageOptions.map((opt) => (
          <Checkbox
            key={opt.value}
            checked={filters.ageGroups.includes(opt.value)}
            onChange={() => filters.toggleAgeGroup(opt.value)}
            label={opt.label}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        {priceRanges.map((range) => {
          const active = filters.priceMin === range.min && filters.priceMax === range.max
          return (
            <Checkbox
              key={range.label}
              checked={active}
              onChange={() =>
                active
                  ? filters.setPriceRange(null, null)
                  : filters.setPriceRange(range.min, range.max)
              }
              label={range.label}
            />
          )
        })}
      </FilterGroup>

      <FilterGroup title="Availability">
        <Checkbox
          checked={filters.onSaleOnly}
          onChange={() => filters.setOnSaleOnly(!filters.onSaleOnly)}
          label="On Sale"
        />
        <Checkbox
          checked={filters.pickupOnly}
          onChange={() => filters.setPickupOnly(!filters.pickupOnly)}
          label="Available for Store Pickup"
        />
      </FilterGroup>

      <button
        type="button"
        onClick={() => filters.reset()}
        className="mt-4 text-sm font-medium text-terracotta-600 hover:text-terracotta-700 cursor-pointer"
      >
        Clear all filters
      </button>
    </div>
  )
}
