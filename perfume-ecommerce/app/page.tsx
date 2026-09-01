'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import { useLanguage } from '@/lib/i18n'
import { ProductImage } from '@/components/ProductImage'

const categories: { key: 'men' | 'women' | 'unisex'; gender: Product['gender'] }[] = [
  { key: 'men', gender: 'Men' },
  { key: 'women', gender: 'Women' },
  { key: 'unisex', gender: 'Unisex' },
]

export default function Home() {
  const { t } = useLanguage()
  const [featured, setFeatured] = useState<Product[]>([])
  // Fresh build trigger

  useEffect(() => {
    fetch('/api/products?pageSize=8')
      .then((res) => res.json())
      .then((json: { products: Product[] }) => setFeatured(json.products))
      .catch(() => setFeatured([]))
  }, [])

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="min-h-[75vh] bg-gradient-to-b from-white to-[#FAFAF8] flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl sm:text-7xl font-serif font-normal text-[#1B4D3E] mb-4">
            SUNNAH MUSK
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 font-light">
            Curated fragrances for the discerning. Each scent tells a story.
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-[#1B4D3E] text-white font-sans font-medium hover:bg-[#0f2f27] transition"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-serif text-[#1B4D3E] text-center mb-16">
            Featured Fragrances
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product) => (
              <button
                key={product.id}
                onClick={() => (window.location.href = `/products?search=${encodeURIComponent(product.name)}`)}
                className="text-left hover:opacity-75 transition"
              >
                <div className="aspect-square bg-gray-100 mb-4 flex items-center justify-center">
                  <ProductImage product={product} className="w-full h-full object-contain" />
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {product.brand || 'Fragrance'}
                </p>
                <h3 className="text-lg font-serif text-gray-900 mb-2">
                  {product.name.substring(0, 30)}
                  {product.name.length > 30 ? '...' : ''}
                </h3>
                <p className="text-lg font-sans font-semibold text-[#D4AF37]">
                  {product.priceStatus === 'pending' ? (
                    <span className="text-gray-400">Price Pending</span>
                  ) : (
                    `$${product.price?.toFixed(2)}`
                  )}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="w-full px-4 py-24 bg-[#FAFAF8] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-serif text-[#1B4D3E] text-center mb-16">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/products?gender=${cat.gender}`}
                className="border border-gray-200 p-12 text-center hover:border-[#1B4D3E] hover:bg-white transition"
              >
                <h3 className="text-2xl font-serif text-[#1B4D3E] mb-2">
                  {t(cat.key)}
                </h3>
                <p className="text-sm text-gray-500">
                  Shop {t(cat.key).toLowerCase()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full px-4 py-24 bg-[#1B4D3E] text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-serif mb-4">Stay Updated</h2>
          <p className="text-white/80 mb-8">
            Be first to know about new fragrances and exclusive events.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </main>
  )
}

function NewsletterForm() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md mx-auto gap-2 sm:gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 px-4 py-3 bg-white/10 text-white placeholder:text-white/50 focus:outline-none"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-[#D4AF37] text-[#1B4D3E] font-sans font-semibold hover:bg-[#E8C749] transition"
      >
        {subscribed ? '✓' : 'Subscribe'}
      </button>
    </form>
  )
}
