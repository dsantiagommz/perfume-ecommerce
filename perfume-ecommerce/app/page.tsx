'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import { useLanguage } from '@/lib/i18n'
import { ProductImage } from '@/components/ProductImage'

const categories: { key: 'men' | 'women' | 'unisex'; gender: Product['gender']; letter: string }[] = [
  { key: 'men', gender: 'Men', letter: 'M' },
  { key: 'women', gender: 'Women', letter: 'W' },
  { key: 'unisex', gender: 'Unisex', letter: 'U' },
]

const scentJourney = [
  {
    phase: 'TOP NOTES',
    duration: '2–3 min',
    color: 'text-[#5c2e3a]',
    border: 'border-[#5c2e3a]',
    notes: ['Bergamot', 'Lemon', 'Grapefruit'],
  },
  {
    phase: 'HEART NOTES',
    duration: '15–60 min',
    color: 'text-[#b8860b]',
    border: 'border-[#b8860b]',
    notes: ['Rose', 'Jasmine', 'Iris'],
  },
  {
    phase: 'BASE NOTES',
    duration: '2–8 hrs',
    color: 'text-[#6b6b68]',
    border: 'border-[#6b6b68]',
    notes: ['Oud', 'Sandalwood', 'Musk'],
  },
]

export default function Home() {
  const { t } = useLanguage()
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products?pageSize=6')
      .then((res) => res.json())
      .then((json: { products: Product[] }) => setFeatured(json.products))
      .catch(() => setFeatured([]))
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero — typography only, luxury minimalism */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center bg-[#0a0a0a] px-4 text-center text-[#f5f3f0]">
        <div className="space-y-8">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-[#b8860b]">Est. 2025</p>
            <h1 className="mt-6 font-serif text-[4rem] font-400 tracking-[0.2em] sm:text-[5rem]">
              SUNNAH MUSK
            </h1>
            <p className="mt-2 font-mono text-[0.75rem] tracking-[0.15em] text-[#6b6b68]">LONDON</p>
          </div>

          <div className="mx-auto max-w-2xl space-y-4">
            <p className="font-serif text-[1.25rem] font-400 text-[#f5f3f0]">
              Curated fragrances for the discerning
            </p>
            <p className="font-mono text-[0.875rem] text-[#f5f3f0]/60">
              Each scent tells a story. Discover layers of emotion with every note.
            </p>
          </div>

          <div>
            <Link
              href="/products"
              className="inline-block border border-[#b8860b] px-10 py-3 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-[#b8860b] transition duration-300 hover:bg-[#b8860b] hover:text-[#0a0a0a]"
            >
              Explore collection
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-3 text-center font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#b8860b]">
          Discover
        </div>
        <h2 className="mb-16 text-center font-serif text-3xl font-400 tracking-[0.1em] text-[#f5f3f0]">
          Featured Fragrances
        </h2>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <button
              key={product.id}
              onClick={() => (window.location.href = `/products?search=${encodeURIComponent(product.name)}`)}
              className="glow-gold group border border-transparent text-center transition duration-300 focus:outline-none"
            >
              <ProductImage product={product} className="mx-auto h-64 w-full object-contain transition group-hover:brightness-110" />
              <div className="mt-8">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-[#6b6b68]">
                  {product.brand || 'Fragrance'}
                </p>
                <h3 className="mt-3 font-serif text-[1.25rem] font-400 text-[#f5f3f0]">
                  {product.name.substring(0, 30)}
                  {product.name.length > 30 ? '...' : ''}
                </h3>
                <p className="mt-4 font-mono text-[1rem] text-[#b8860b]">
                  {product.priceStatus === 'pending' ? (
                    <span className="text-[#f5f3f0]/40">Price Pending</span>
                  ) : (
                    `$${product.price?.toFixed(2)}`
                  )}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Scent Journey — signature section */}
      <section className="border-y border-[#3a3a38] bg-[#0a0a0a] py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 text-center font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#b8860b]">
            The Experience
          </div>
          <h2 className="mb-20 text-center font-serif text-3xl font-400 tracking-[0.1em] text-[#f5f3f0]">
            Scent Journey Timeline
          </h2>

          {/* Timeline visualization */}
          <div className="mb-16 hidden items-end gap-2 sm:flex sm:justify-center">
            {scentJourney.map((phase, i) => (
              <div key={phase.phase} className="flex flex-col items-center">
                <div className={`h-12 w-12 rounded-full border-2 ${phase.border}`} />
                {i < scentJourney.length - 1 && (
                  <div className={`h-px w-12 bg-gradient-to-r ${phase.color.replace('text', 'from')} to-transparent`} style={{ width: '48px', height: '2px', backgroundColor: phase.color.includes('plum') ? '#5c2e3a' : phase.color.includes('gold') ? '#b8860b' : '#6b6b68' }} />
                )}
              </div>
            ))}
          </div>

          {/* Phase details */}
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            {scentJourney.map((phase) => (
              <div key={phase.phase} className="text-center">
                <p className={`font-mono text-[0.7rem] uppercase tracking-[0.2em] ${phase.color}`}>
                  {phase.phase}
                </p>
                <p className="mt-2 font-mono text-[0.75rem] text-[#f5f3f0]/50">{phase.duration}</p>

                <ul className="mt-8 space-y-3">
                  {phase.notes.map((note) => (
                    <li
                      key={note}
                      className={`border-b ${phase.border}/20 py-2 font-mono text-[0.875rem] text-[#f5f3f0] transition hover:border-opacity-100 hover:text-[#b8860b]`}
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-4 text-center font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#b8860b]">
          Collections
        </div>
        <h2 className="mb-20 text-center font-serif text-3xl font-400 tracking-[0.1em] text-[#f5f3f0]">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/products?gender=${cat.gender}`}
              className="glow-gold group relative flex flex-col items-center justify-center border border-[#6b6b68]/40 px-6 py-16 text-center transition duration-300 hover:border-[#b8860b]"
            >
              <span className="font-serif text-8xl font-400 text-[#f5f3f0]/60 transition duration-300 group-hover:text-[#b8860b]">
                {cat.letter}
              </span>
              <span className="absolute bottom-4 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-[#6b6b68] transition group-hover:text-[#b8860b]">
                {t(cat.key)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-[#3a3a38] bg-[#1a1a1a] py-24 text-center text-[#f5f3f0]">
        <div className="mx-auto max-w-2xl px-4">
          <div className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#b8860b]">
            Stay Updated
          </div>
          <h2 className="font-serif text-3xl font-400 tracking-[0.1em]">
            Latest Releases & Stories
          </h2>
          <p className="mt-4 font-mono text-[0.875rem] text-[#f5f3f0]/60">
            Be first to know about new fragrances, exclusive events, and curated insights.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
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
    setTimeout(() => setSubscribed(false), 4000)
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-4">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="border-b border-[#6b6b68] bg-transparent px-3 py-3 font-mono text-[0.875rem] text-[#f5f3f0] placeholder:text-[#f5f3f0]/40 focus:border-[#b8860b] focus:outline-none"
      />
      <button
        type="submit"
        className="bg-[#b8860b] px-6 py-3 font-mono text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[#0a0a0a] transition duration-300 hover:bg-[#dcbf7c]"
      >
        {subscribed ? '✓ Subscribed' : 'Subscribe'}
      </button>
    </form>
  )
}
