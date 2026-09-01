'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
]

const footerLinks: { key: 'footerAbout' | 'footerContact' | 'footerPrivacy' | 'footerTerms' | 'footerShipping' | 'footerReturns'; href: string }[] = [
  { key: 'footerAbout', href: '/about' },
  { key: 'footerContact', href: '/contact' },
  { key: 'footerPrivacy', href: '/privacy' },
  { key: 'footerTerms', href: '/terms' },
  { key: 'footerShipping', href: '/shipping' },
  { key: 'footerReturns', href: '/returns' },
]

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-gray-200 bg-[#FAFAF8]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl text-[#1B4D3E] mb-4">SUNNAH MUSK</h3>
            <p className="text-sm text-gray-600 mb-6">
              Curated luxury fragrances for the discerning.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-gray-400 hover:text-[#1B4D3E] transition"
                >
                  <span className="text-sm font-sans">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-sans font-semibold text-gray-900 mb-4 text-sm">Information</h4>
            <ul className="space-y-2">
              {footerLinks.slice(0, 3).map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-[#1B4D3E] transition">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-sans font-semibold text-gray-900 mb-4 text-sm">Support</h4>
            <ul className="space-y-2">
              {footerLinks.slice(3).map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-[#1B4D3E] transition">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans font-semibold text-gray-900 mb-4 text-sm">Contact</h4>
            <p className="text-sm text-gray-600 mb-2">hello@sunnah.com</p>
            <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} SUNNAH MUSK. {t('rightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  )
}
