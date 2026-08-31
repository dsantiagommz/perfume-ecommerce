'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import { useCart } from '@/lib/useCart'
import { useLanguage } from '@/lib/i18n'
import { ProductImage } from '@/components/ProductImage'

const categories: { key: 'men' | 'women' | 'unisex'; gender: Product['gender']; gradient: string }[] = [
  { key: 'men', gender: 'Men', gradient: 'from-slate-700 to-slate-900' },
  { key: 'women', gender: 'Women', gradient: 'from-rose-400 to-rose-600' },
  { key: 'unisex', gender: 'Unisex', gradient: 'from-violet-500 to-violet-700' },
]

const testimonials = [
  { name: 'Isabelle R.', quote: 'The scent lasted all day and the packaging felt genuinely luxurious. My new go-to shop.' },
  { name: 'Marcus T.', quote: "Found a fragrance I'd been searching for years. Fast shipping, beautifully presented." },
  { name: 'Sofia G.', quote: 'Customer service helped me pick the perfect gift. It arrived exactly on time.' },
]

export default function Home() {
  const { addToCart } = useCart()
  const { t } = useLanguage()
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products?pageSize=8')
      .then((res) => res.json())
      .then((json: { products: Product[] }) => setFeatured(json.products))
      .catch(() => setFeatured([]))
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#0f0d0b] text-[#f2ede3]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1613] via-[#0f0d0b] to-black opacity-90" />
        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <p className="mb-4 text-xs font-medium tracking-[0.3em] text-[#c9a961]">MAISON</p>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
            {t('heroTitle')}
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base text-[#f2ede3]/70 sm:text-lg">
            {t('heroSubtitle')}
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block rounded-full bg-[#c9a961] px-8 py-3 text-sm font-semibold tracking-wide text-[#0f0d0b] transition hover:bg-[#dcbf7c]"
          >
            {t('shopNow')}
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-serif text-3xl text-[#171412]">{t('featured')}</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <div key={product.id} className="group overflow-hidden rounded-lg border border-black/5 bg-white transition hover:shadow-lg">
              <Link href="/products">
                <ProductImage product={product} className="h-48 w-full sm:h-56" />
              </Link>
              <div className="p-4">
                <p className="text-xs uppercase tracking-wide text-black/50">{product.brand}</p>
                <h3 className="mt-1 truncate font-serif text-base text-[#171412]">{product.name}</h3>
                <div className="mt-3 flex items-center justify-between">
                  {product.priceStatus === 'pending' ? (
                    <span className="text-sm font-medium text-amber-600">—</span>
                  ) : (
                    <span className="font-semibold text-[#171412]">${product.price}</span>
                  )}
                  <button
                    onClick={() => addToCart(product, 1)}
                    disabled={product.priceStatus === 'pending'}
                    className="rounded-full border border-[#c9a961] px-3 py-1 text-xs font-medium text-[#171412] transition hover:bg-[#c9a961] hover:text-[#0f0d0b] disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#f2ede3]/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center font-serif text-3xl text-[#171412]">{t('shopByCategory')}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/products?gender=${cat.gender}`}
                className={`relative flex h-56 items-end justify-center overflow-hidden rounded-lg bg-gradient-to-br ${cat.gradient} p-6 text-white shadow-sm transition hover:opacity-90`}
              >
                <span className="font-serif text-2xl tracking-wide">{t(cat.key)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-serif text-3xl text-[#171412]">{t('testimonialsTitle')}</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {testimonials.map((item) => (
            <figure key={item.name} className="rounded-lg border border-black/5 bg-white p-6 text-center shadow-sm">
              <blockquote className="text-sm italic text-[#171412]/80">&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#c9a961]">
                {item.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#0f0d0b] py-16 text-center text-[#f2ede3]">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="font-serif text-3xl">{t('newsletterTitle')}</h2>
          <p className="mt-3 text-sm text-[#f2ede3]/70">{t('newsletterSubtitle')}</p>
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
  }

  if (subscribed) {
    return <p className="mt-6 text-[#c9a961]">Thank you for subscribing!</p>
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('newsletterPlaceholder')}
        className="w-full min-w-0 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm placeholder:text-[#f2ede3]/40 focus:border-[#c9a961] focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-[#c9a961] px-5 py-2.5 text-sm font-semibold text-[#0f0d0b] transition hover:bg-[#dcbf7c]"
      >
        {t('subscribe')}
      </button>
    </form>
  )
}
