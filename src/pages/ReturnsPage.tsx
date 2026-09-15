import { businessConfig } from '@/config/business'

export function ReturnsPage() {
  return (
    <div className="container-page py-10 max-w-2xl">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900 mb-8">
        Returns &amp; Exchanges
      </h1>

      <div className="flex flex-col gap-6 text-sm sm:text-base text-ink-800">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-1">Return Policy</h2>
          <p>
            Items can be returned within {businessConfig.returnWindowDays} days of delivery, provided
            they are unused, unwashed and have original tags attached.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-1">Exchange Policy</h2>
          <p>
            Size exchanges are accepted within {businessConfig.exchangeWindowDays} days of delivery,
            subject to stock availability.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-1">
            Non-Returnable Items
          </h2>
          <p>Innerwear, socks, and items marked "Final Sale" are not eligible for return.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-1">Refund Process</h2>
          <p>
            Once your return is received and inspected, refunds are processed to your original
            payment method within 5-7 business days.
          </p>
        </section>
      </div>
    </div>
  )
}
