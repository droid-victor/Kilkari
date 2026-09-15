import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { businessConfig } from '@/config/business'
import { storeConfig } from '@/config/store'

const faqs = [
  { q: 'Do you offer Cash on Delivery?', a: businessConfig.codAvailable ? 'Yes, Cash on Delivery is available on eligible orders.' : 'Cash on Delivery is currently not available.' },
  { q: 'Do you deliver locally?', a: businessConfig.localDeliveryEnabled ? `Yes, we offer local delivery within ${businessConfig.localDeliveryRadiusKm} km of our store.` : 'Local delivery is currently not available.' },
  { q: 'Can I pick up my order from the store?', a: businessConfig.storePickupEnabled ? 'Yes, choose "Store Pickup" at checkout and collect from our store.' : 'Store pickup is currently not available.' },
  { q: 'How long does delivery take?', a: 'Standard delivery typically takes 2-3 business days. Local delivery may be available the same or next day.' },
  { q: 'Can I exchange a size?', a: `Yes, exchanges are accepted within ${businessConfig.exchangeWindowDays} days of delivery, subject to our exchange policy.` },
  { q: 'How do I choose the right size?', a: 'Use our Size Guide and "Find My Size" tool on product pages for a recommended size based on age, height and weight.' },
  { q: 'Do you have school shoes?', a: 'Yes, we carry a wide range of school shoes across sizes and brands.' },
  { q: 'Do you sell newborn clothing?', a: 'Yes, our newborn collection includes rompers, bodysuits, sleepsuits and gift sets.' },
  { q: 'How can I check store availability?', a: 'Product pages show store stock and pickup availability, or you can call/WhatsApp us directly.' },
  { q: 'Can I order through WhatsApp?', a: businessConfig.whatsappOrderingEnabled ? 'Yes, you can inquire about products or place orders via WhatsApp.' : 'WhatsApp ordering is currently not available.' },
  { q: 'Where is your store?', a: storeConfig.address },
  { q: 'What are your store timings?', a: 'See our Store page for current opening hours.' },
]

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="container-page py-10 max-w-2xl">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900 mb-8">
        Frequently Asked Questions
      </h1>

      <div className="flex flex-col divide-y divide-ink-900/8">
        {faqs.map((faq, i) => {
          const open = openIndex === i
          return (
            <div key={faq.q}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-4 py-4 text-left cursor-pointer min-h-11"
              >
                <span className="text-sm sm:text-base font-medium text-ink-900">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={clsx('shrink-0 transition-transform text-ink-400', open && 'rotate-180')}
                />
              </button>
              {open && <p className="pb-4 text-sm text-ink-600">{faq.a}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
