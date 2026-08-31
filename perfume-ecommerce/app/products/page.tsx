'use client'

import { useEffect, useState } from 'react'
import type { Product } from '@/lib/types'
import { useCart } from '@/lib/useCart'
import { useRouter } from 'next/navigation'
import { ProductImage } from '@/components/ProductImage'

const MAX_PRICE = 925
const PAGE_SIZE = 48

interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
  facets: { categories: string[]; genders: string[]; fragranceTypes: string[] }
}

export default function ProductsPage() {
  const { addToCart } = useCart()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [fragranceType, setFragranceType] = useState<string | null>(null)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const [page, setPage] = useState(1)

  const [data, setData] = useState<ProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [category, fragranceType, minPrice, maxPrice])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
      minPrice: String(minPrice),
      maxPrice: String(maxPrice),
    })
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (category) params.set('category', category)
    if (fragranceType) params.set('fragranceType', fragranceType)

    fetch(`/api/products?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json: ProductsResponse) => setData(json))
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('Failed to load products', err)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [debouncedSearch, category, fragranceType, minPrice, maxPrice, page])

  const products = data?.products ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Perfumes</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="md:col-span-1">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search perfumes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={MAX_PRICE}
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max={MAX_PRICE}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">${minPrice} - ${maxPrice}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setCategory(null)}
                    className={`block w-full text-left px-2 py-1 rounded ${
                      !category ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {data?.facets.categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`block w-full text-left px-2 py-1 rounded ${
                        category === c ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setFragranceType(null)}
                    className={`block w-full text-left px-2 py-1 rounded ${
                      !fragranceType ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    All Types
                  </button>
                  {data?.facets.fragranceTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setFragranceType(t)}
                      className={`block w-full text-left px-2 py-1 rounded ${
                        fragranceType === t ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <p className="text-gray-600 mb-4">
              {loading ? 'Loading…' : `${data?.total ?? 0} products found`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                  <ProductImage product={product} className="w-full h-64" />
                  <div className="p-4">
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                    <div className="flex items-center justify-between mb-3">
                      {product.priceStatus === 'pending' ? (
                        <span className="text-sm font-semibold text-amber-600">Precio pendiente</span>
                      ) : (
                        <span className="text-2xl font-bold">${product.price}</span>
                      )}
                      {product.priceStatus === 'wholesale_only' && (
                        <span className="text-xs text-gray-500">precio mayorista</span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product, 1)
                        router.push('/cart')
                      }}
                      disabled={product.priceStatus === 'pending'}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
