import { Link } from 'react-router-dom'
import { Phone, MessageCircle } from 'lucide-react'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { brandConfig } from '@/config/brand'
import { storeConfig } from '@/config/store'
import {
  footerShopLinks,
  footerCareLinks,
  footerStoreLinks,
  footerCompanyLinks,
} from '@/constants/navigation'

function FooterColumn({ title, links }: { title: string; links: { label: string; path: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-3">{title}</h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.path}>
            <Link to={link.path} className="text-sm text-ink-800 hover:text-terracotta-600">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink-900 text-cream-100 mt-16 pb-20 lg:pb-0">
      <div className="container-page py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <span className="font-display text-2xl font-semibold text-cream-50">
            {brandConfig.wordmark}
          </span>
          <p className="mt-2 text-sm text-cream-100/70 max-w-xs">{brandConfig.tagline}</p>
          <div className="flex items-center gap-3 mt-4">
            {storeConfig.socialLinks.instagram && (
              <a
                href={storeConfig.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-full bg-cream-50/10 hover:bg-cream-50/20"
              >
                <SocialIcon platform="instagram" />
              </a>
            )}
            {storeConfig.socialLinks.facebook && (
              <a
                href={storeConfig.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-full bg-cream-50/10 hover:bg-cream-50/20"
              >
                <SocialIcon platform="facebook" />
              </a>
            )}
            {storeConfig.socialLinks.youtube && (
              <a
                href={storeConfig.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-2 rounded-full bg-cream-50/10 hover:bg-cream-50/20"
              >
                <SocialIcon platform="youtube" />
              </a>
            )}
          </div>
        </div>

        <FooterColumn title="Shop" links={footerShopLinks} />
        <FooterColumn title="Customer Care" links={footerCareLinks} />
        <FooterColumn title="Store" links={footerStoreLinks} />
        <FooterColumn title="Company" links={footerCompanyLinks} />
      </div>

      <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-cream-50/10 text-xs text-cream-100/60">
        <p>
          &copy; {year} {storeConfig.legalName}. All Rights Reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href={`tel:${storeConfig.phone}`} className="flex items-center gap-1.5 hover:text-cream-50">
            <Phone size={14} /> Call Store
          </a>
          <a
            href={`https://wa.me/${storeConfig.whatsapp.replace(/[^\d]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-cream-50"
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
        </div>
      </div>
    </footer>
  )
}
