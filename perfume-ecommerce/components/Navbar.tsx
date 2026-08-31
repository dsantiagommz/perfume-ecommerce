'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/useCart'
import { useLanguage } from '@/lib/i18n'

export function Navbar() {
  const { itemCount } = useCart()
  const { locale, setLocale, t } = useLanguage()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = search.trim()
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : '/products')
    setMobileOpen(false)
  }

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#0f0d0b] text-[#f2ede3]">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 font-serif text-2xl tracking-[0.15em]">
          MAISON<span className="text-[#c9a961]">.</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm tracking-wide md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-[#f2ede3]/80 transition hover:text-[#c9a961]">
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto hidden max-w-xs flex-1 md:flex">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-[#f2ede3] placeholder:text-[#f2ede3]/40 focus:border-[#c9a961] focus:outline-none"
          />
        </form>

        <div className="ml-auto flex items-center gap-4 md:ml-0">
          <button
            type="button"
            onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
            className="hidden text-xs font-medium tracking-widest text-[#f2ede3]/70 hover:text-[#c9a961] sm:block"
            aria-label="Toggle language"
          >
            {locale === 'en' ? 'EN' : 'ES'} / {locale === 'en' ? 'ES' : 'EN'}
          </button>

          <Link href="/account" className="hidden text-sm text-[#f2ede3]/80 hover:text-[#c9a961] sm:block">
            {t('login')}
          </Link>

          <Link href="/cart" className="relative flex items-center text-[#f2ede3]/90 hover:text-[#c9a961]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.907-3.98 2.531-5.815a2.25 2.25 0 00-2.14-2.935H5.106M7.5 14.25L5.106 5.272" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a961] text-[10px] font-semibold text-[#0f0d0b]">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="text-[#f2ede3]/90 md:hidden"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4 flex">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-[#f2ede3] placeholder:text-[#f2ede3]/40 focus:border-[#c9a961] focus:outline-none"
            />
          </form>
          <nav className="flex flex-col gap-3 text-sm">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="text-[#f2ede3]/80 hover:text-[#c9a961]">
                {link.label}
              </Link>
            ))}
            <Link href="/account" onClick={() => setMobileOpen(false)} className="text-[#f2ede3]/80 hover:text-[#c9a961]">
              {t('account')}
            </Link>
            <button
              type="button"
              onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
              className="w-fit text-xs font-medium tracking-widest text-[#f2ede3]/70 hover:text-[#c9a961]"
            >
              {locale === 'en' ? 'EN' : 'ES'} / {locale === 'en' ? 'ES' : 'EN'}
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
