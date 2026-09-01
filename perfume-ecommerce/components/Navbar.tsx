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

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl font-normal text-[#1B4D3E]">
            SUNNAH
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden sm:block flex-1 max-w-xs">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full px-4 py-2 text-sm border border-gray-200 focus:outline-none focus:border-[#1B4D3E]"
            />
          </form>

          {/* Right side */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
              className="text-sm font-sans text-gray-600 hover:text-[#1B4D3E] transition"
              aria-label="Toggle language"
            >
              {locale === 'en' ? 'EN' : 'ES'}
            </button>

            <Link href="/account" className="text-gray-600 hover:text-[#1B4D3E] transition" aria-label={t('account')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.964 0a9 9 0 10-11.964 0m11.964 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>

            <Link href="/cart" className="relative text-gray-600 hover:text-[#1B4D3E] transition" aria-label={t('cart')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.907-3.98 2.531-5.815a2.25 2.25 0 00-2.14-2.935H5.106M7.5 14.25L5.106 5.272" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-[#D4AF37] text-xs font-bold text-white rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="mt-3 sm:hidden">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full px-4 py-2 text-sm border border-gray-200 focus:outline-none focus:border-[#1B4D3E]"
          />
        </form>
      </div>
    </header>
  )
}
