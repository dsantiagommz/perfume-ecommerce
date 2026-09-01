'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 2.1.25 2.9.55.8.3 1.5.7 2.15 1.35.65.65 1.05 1.35 1.35 2.15.3.8.5 1.73.55 2.9.07 1.25.07 1.65.07 4.85s0 3.6-.07 4.85c-.05 1.17-.25 2.1-.55 2.9-.3.8-.7 1.5-1.35 2.15a5.7 5.7 0 01-2.15 1.35c-.8.3-1.73.5-2.9.55-1.25.07-1.65.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-2.1-.25-2.9-.55a5.7 5.7 0 01-2.15-1.35 5.7 5.7 0 01-1.35-2.15c-.3-.8-.5-1.73-.55-2.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85c.05-1.17.25-2.1.55-2.9.3-.8.7-1.5 1.35-2.15A5.7 5.7 0 016.32 .75c.8-.3 1.73-.5 2.9-.55C10.47 .13 10.87 .13 12 2.2zm0 1.8c-3.14 0-3.5 0-4.74.07-.96.04-1.48.2-1.83.34-.46.18-.79.39-1.13.73-.34.34-.55.67-.73 1.13-.14.35-.3.87-.34 1.83C3.16 8.5 3.16 8.86 3.16 12s0 3.5.07 4.74c.04.96.2 1.48.34 1.83.18.46.39.79.73 1.13.34.34.67.55 1.13.73.35.14.87.3 1.83.34 1.24.07 1.6.07 4.74.07s3.5 0 4.74-.07c.96-.04 1.48-.2 1.83-.34.46-.18.79-.39 1.13-.73.34-.34.55-.67.73-1.13.14-.35.3-.87.34-1.83.07-1.24.07-1.6.07-4.74s0-3.5-.07-4.74c-.04-.96-.2-1.48-.34-1.83a2.9 2.9 0 00-.73-1.13 2.9 2.9 0 00-1.13-.73c-.35-.14-.87-.3-1.83-.34C15.5 3.16 15.14 3.16 12 3.16v.84zm0 3.06a5 5 0 110 10 5 5 0 010-10zm0 1.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4zm5.2-1.98a1.17 1.17 0 110 2.34 1.17 1.17 0 010-2.34z' },
  { label: 'Facebook', href: 'https://facebook.com', icon: 'M13.5 21v-7.5h2.5l.5-3h-3V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.28C15.8 4.2 14.9 4.1 13.85 4.1c-2.4 0-4.05 1.46-4.05 4.15v2.05H7.3v3h2.5V21h3.7z' },
  { label: 'TikTok', href: 'https://tiktok.com', icon: 'M16.6 2h-3.1v13.4a3.1 3.1 0 11-2.2-2.97v-3.2a6.3 6.3 0 104.7 6.1c0-.14 0-.28-.01-.42a7.7 7.7 0 004.4 1.4V13.2a4.4 4.4 0 01-3.8-3.9V2z' },
]

const footerLinks: { key: 'footerAbout' | 'footerContact' | 'footerPrivacy' | 'footerTerms' | 'footerShipping' | 'footerReturns'; href: string }[] = [
  { key: 'footerAbout', href: '/about' },
  { key: 'footerContact', href: '/contact' },
  { key: 'footerPrivacy', href: '/privacy' },
  { key: 'footerTerms', href: '/terms' },
  { key: 'footerShipping', href: '/shipping' },
  { key: 'footerReturns', href: '/returns' },
]

const paymentMethods = ['Visa', 'Mastercard', 'Amex', 'PayPal']

export function Footer() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="mt-auto border-t border-[#3a3a38] bg-[#0a0a0a] text-[#f5f3f0]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 sm:grid-cols-3 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="font-serif text-[1.5rem] font-400 tracking-[0.15em]">SUNNAH</p>
            <p className="mt-4 font-mono text-[0.75rem] text-[#f5f3f0]/50">
              Curated luxury fragrances for the modern connoisseur.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-[#6b6b68] transition hover:text-[#b8860b]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#b8860b]">Information</p>
            <ul className="mt-6 space-y-3 font-mono text-[0.8rem] text-[#f5f3f0]/70">
              {footerLinks.slice(0, 3).map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="transition hover:text-[#b8860b]">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#b8860b]">Support</p>
            <ul className="mt-6 space-y-3 font-mono text-[0.8rem] text-[#f5f3f0]/70">
              {footerLinks.slice(3).map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="transition hover:text-[#b8860b]">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payments */}
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#b8860b]">Accepted</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <span key={method} className="border border-[#6b6b68]/50 px-2 py-1.5 font-mono text-[0.7rem] text-[#f5f3f0]/60">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#3a3a38] pt-8 text-center">
          <p className="font-mono text-[0.7rem] text-[#6b6b68]">
            © {new Date().getFullYear()} SUNNAH MUSK. {t('rightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  )
}
