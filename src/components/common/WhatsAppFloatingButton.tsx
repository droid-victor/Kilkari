import { MessageCircle } from 'lucide-react'
import { storeGeneralInquiryUrl } from '@/services/whatsappService'

export function WhatsAppFloatingButton() {
  return (
    <a
      href={storeGeneralInquiryUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed z-20 right-4 bottom-[calc(8rem+env(safe-area-inset-bottom))] lg:bottom-6 flex h-13 w-13 items-center justify-center rounded-full bg-sage-600 text-cream-50 shadow-lifted hover:brightness-95 transition"
    >
      <MessageCircle size={26} fill="currentColor" className="text-cream-50" strokeWidth={0} />
    </a>
  )
}
