'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-auto border-t border-[#E8E8E6] bg-white text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl font-600 text-[#1B4D3E]">SUNNAH</p>
            <p className="mt-4 font-body text-sm text-[#6B6B6B]">
              Premium fragrances for everyone
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="font-body font-600 text-[#1B4D3E] mb-4">Shop</p>
            <ul className="space-y-2 font-body text-sm text-[#6B6B6B]">
              <li><Link href="/products" className="hover:text-[#1B4D3E] transition">All Fragrances</Link></li>
              <li><Link href="/products?gender=Women" className="hover:text-[#1B4D3E] transition">Women</Link></li>
              <li><Link href="/products?gender=Men" className="hover:text-[#1B4D3E] transition">Men</Link></li>
              <li><Link href="/products?gender=Unisex" className="hover:text-[#1B4D3E] transition">Unisex</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-body font-600 text-[#1B4D3E] mb-4">Company</p>
            <ul className="space-y-2 font-body text-sm text-[#6B6B6B]">
              <li><Link href="/about" className="hover:text-[#1B4D3E] transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-[#1B4D3E] transition">Contact</Link></li>
              <li><Link href="/shipping" className="hover:text-[#1B4D3E] transition">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-[#1B4D3E] transition">Returns</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-body font-600 text-[#1B4D3E] mb-4">Legal</p>
            <ul className="space-y-2 font-body text-sm text-[#6B6B6B]">
              <li><Link href="/privacy" className="hover:text-[#1B4D3E] transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-[#1B4D3E] transition">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E8E8E6] pt-8 text-center font-body text-sm text-[#6B6B6B]">
          <p>© {new Date().getFullYear()} SUNNAH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
