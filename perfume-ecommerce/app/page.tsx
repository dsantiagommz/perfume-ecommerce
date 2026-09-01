'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import { useLanguage } from '@/lib/i18n'
import { ProductImage } from '@/components/ProductImage'

export default function Home() {
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
      {/* Hero Section */}
      <section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="bg-[#F5F5F5] flex items-center justify-center min-h-[500px]">
            {featured.length > 0 && (
              <ProductImage
                product={featured[0]}
                className="h-96 w-96 object-contain"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center px-6 sm:px-10 py-12 sm:py-20">
            <h1 className="font-display text-4xl sm:text-5xl font-600 text-[#1B4D3E] mb-4">
              Discover Your Scent
            </h1>
            <p className="font-body text-lg text-[#6B6B6B] mb-8 max-w-md">
              Explore our curated collection of premium fragrances from around the world. Find the perfect scent for every moment.
            </p>
            <div className="flex gap-4">
              <Link href="/products" className="btn-primary">
                Shop Now
              </Link>
              <Link href="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-600 text-[#1B4D3E] mb-4">
            Featured Fragrances
          </h2>
          <p className="text-[#6B6B6B] mb-12 max-w-2xl">
            Handpicked selection of our most popular and highest-rated fragrances
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <Link
                key={product.id}
                href={`/products?search=${encodeURIComponent(product.name)}`}
                className="group"
              >
                <div className="bg-[#F5F5F5] rounded-lg p-6 mb-4 flex items-center justify-center min-h-[300px] overflow-hidden">
                  <ProductImage
                    product={product}
                    className="h-48 w-full object-contain group-hover:scale-105 transition duration-300"
                  />
                </div>
                <p className="text-sm text-[#6B6B6B] mb-2">{product.brand || 'Premium Fragrance'}</p>
                <h3 className="font-display text-lg font-600 text-[#1A1A1A] mb-3 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-lg font-600 text-[#D4AF37]">
                  {product.priceStatus === 'pending' ? (
                    <span className="text-[#6B6B6B]">Price pending</span>
                  ) : (
                    `$${product.price?.toFixed(2)}`
                  )}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#FAFAF8] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-600 text-[#1B4D3E] mb-12">
            Shop by Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Women', href: '/products?gender=Women', icon: '♀' },
              { label: 'Men', href: '/products?gender=Men', icon: '♂' },
              { label: 'Unisex', href: '/products?gender=Unisex', icon: '⊙' },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="bg-white border border-[#E8E8E6] p-8 text-center hover:border-[#1B4D3E] hover:shadow-lg transition"
              >
                <div className="text-5xl mb-4 font-display">{cat.icon}</div>
                <h3 className="font-display text-2xl font-600 text-[#1B4D3E]">
                  {cat.label}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1B4D3E] py-16 sm:py-24 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-600 mb-4">
            Join Our Fragrance Community
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Sign up for exclusive updates on new arrivals and special offers
          </p>
          <form className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white text-[#1A1A1A] placeholder:text-[#6B6B6B] focus:outline-none"
              required
            />
            <button type="submit" className="bg-[#D4AF37] text-[#1B4D3E] font-600 px-6 py-3 hover:bg-gray-100 transition">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
