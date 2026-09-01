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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = search.trim()
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : '/products')
  }

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[#3a3a38] bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Top section: Logo centered */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-block font-serif text-3xl font-400 tracking-[0.2em] text-[#f5f3f0]">
            SUNNAH MUSK
          </Link>
          <div className="mt-1 font-mono text-[0.75rem] tracking-[0.15em] text-[#b8860b] uppercase">
            London
          </div>
        </div>

        {/* Navigation grid */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Navigation links */}
          <nav className="flex items-center justify-center gap-6 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-[#f5f3f0]/60 sm:justify-start">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition duration-300 hover:text-[#b8860b]">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Center: Search (hidden on mobile, shown on sm+) */}
          <form onSubmit={handleSearch} className="hidden w-full max-w-xs sm:block">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full border-b border-[#6b6b68] bg-transparent px-2 py-1.5 font-mono text-[0.875rem] text-[#f5f3f0] placeholder:text-[#f5f3f0]/30 focus:border-[#b8860b] focus:outline-none"
            />
          </form>

          {/* Right: Actions */}
          <div className="flex items-center justify-center gap-6 sm:justify-end">
            <button
              type="button"
              onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
              className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-[#f5f3f0]/60 transition hover:text-[#b8860b]"
              aria-label="Toggle language"
            >
              {locale === 'en' ? 'EN' : 'ES'}
            </button>

            <div className="w-px h-4 bg-[#3a3a38]" />

            <Link href="/account" className="text-[#f5f3f0]/60 transition hover:text-[#b8860b]" aria-label={t('account')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.964 0a9 9 0 10-11.964 0m11.964 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>

            <Link href="/cart" className="relative flex items-center text-[#f5f3f0]/60 transition hover:text-[#b8860b]" aria-label={t('cart')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.907-3.98 2.531-5.815a2.25 2.25 0 00-2.14-2.935H5.106M7.5 14.25L5.106 5.272" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-3 w-3 items-center justify-center bg-[#b8860b] font-mono text-[8px] font-bold text-[#0a0a0a]">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="mt-4 block sm:hidden">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full border-b border-[#6b6b68] bg-transparent px-2 py-1.5 font-mono text-[0.875rem] text-[#f5f3f0] placeholder:text-[#f5f3f0]/30 focus:border-[#b8860b] focus:outline-none"
          />
        </form>
      </div>
    </header>
  )
}
