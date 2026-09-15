import { useState } from 'react'
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react'
import { storeConfig } from '@/config/store'
import { storeGeneralInquiryUrl } from '@/services/whatsappService'
import { Button } from '@/components/ui/Button'

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900 mb-8">
        Contact Us
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="flex flex-col gap-4">
          <a href={`tel:${storeConfig.phone}`} className="flex items-center gap-3 text-ink-800 hover:text-terracotta-600">
            <Phone size={20} /> {storeConfig.phone}
          </a>
          <a
            href={storeGeneralInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-ink-800 hover:text-terracotta-600"
          >
            <MessageCircle size={20} /> WhatsApp Us
          </a>
          <a href={`mailto:${storeConfig.email}`} className="flex items-center gap-3 text-ink-800 hover:text-terracotta-600">
            <Mail size={20} /> {storeConfig.email}
          </a>
          <div className="flex items-start gap-3 text-ink-800">
            <MapPin size={20} className="shrink-0 mt-0.5" /> {storeConfig.address}
          </div>

          <div className="mt-4">
            <h2 className="text-sm font-semibold text-ink-900 mb-2">Opening Hours</h2>
            <div className="flex flex-col gap-0.5 text-sm text-ink-600">
              {storeConfig.openingHours.map((h) => (
                <span key={h.day}>
                  {h.day}: {h.hours}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          {submitted ? (
            <p className="text-sage-600 font-medium">
              Thanks for reaching out! We'll get back to you shortly.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
              <input
                required
                placeholder="Your Name"
                className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                className="h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500"
              />
              <textarea
                required
                placeholder="Your Message"
                rows={4}
                className="rounded-lg border border-ink-900/15 px-3 py-2 text-sm focus:outline-none focus:border-terracotta-500"
              />
              <Button type="submit">Send Message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
