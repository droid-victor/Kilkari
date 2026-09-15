import { storeConfig } from '@/config/store'

export function TermsPage() {
  return (
    <div className="container-page py-10 max-w-2xl text-sm sm:text-base text-ink-800 flex flex-col gap-4">
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-2">Terms of Service</h1>
      <p>
        By using the {storeConfig.name} website, you agree to our terms of use, including our
        policies on orders, payments, delivery, returns and exchanges.
      </p>
      <p>These terms may be updated from time to time. Continued use of the site constitutes acceptance of any changes.</p>
    </div>
  )
}
