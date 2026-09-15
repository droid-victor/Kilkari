import { X } from 'lucide-react'
import { FilterPanelContent } from '@/components/filters/FilterPanelContent'
import { Button } from '@/components/ui/Button'
import { Portal } from '@/components/common/Portal'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'

export function FilterDrawer({
  open,
  onClose,
  resultCount,
}: {
  open: boolean
  onClose: () => void
  resultCount: number
}) {
  useBodyScrollLock(open)
  if (!open) return null

  return (
    <Portal>
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="fixed inset-0 bg-ink-900/40" onClick={onClose} aria-hidden="true" />
        <div className="fixed bottom-0 left-0 right-0 max-h-[85dvh] rounded-t-2xl bg-cream-50 flex flex-col pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-between px-4 h-14 border-b border-ink-900/8 shrink-0">
            <h2 className="font-semibold text-ink-900">Filters</h2>
            <button type="button" aria-label="Close filters" onClick={onClose} className="p-2 cursor-pointer">
              <X size={20} />
            </button>
          </div>
          <div className="overflow-y-auto px-4 flex-1">
            <FilterPanelContent />
          </div>
          <div className="p-4 border-t border-ink-900/8 shrink-0">
            <Button fullWidth onClick={onClose}>
              Show {resultCount} results
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  )
}
