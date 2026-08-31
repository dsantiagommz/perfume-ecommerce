import { NextRequest, NextResponse } from 'next/server'
import { products, categories, genders, fragranceTypes } from '@/lib/mockData'

// Serves the wholesale catalog (lib/data/products.json) with the same
// search/filter/pagination contract a future Supabase-backed version would
// use — swap the body of this handler for a `supabase.from('products')`
// query without changing the response shape or the client call sites.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.trim().toLowerCase() ?? ''
  const category = searchParams.get('category')
  const gender = searchParams.get('gender')
  const fragranceType = searchParams.get('fragranceType')
  const minPrice = searchParams.has('minPrice') ? Number(searchParams.get('minPrice')) : 0
  const maxPrice = searchParams.has('maxPrice') ? Number(searchParams.get('maxPrice')) : Infinity
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const pageSize = Math.min(96, Math.max(1, Number(searchParams.get('pageSize') ?? 48)))
  const sort = searchParams.get('sort')

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search || p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search)
    const matchesCategory = !category || p.category === category
    const matchesGender = !gender || p.gender === gender
    const matchesType = !fragranceType || p.fragranceType === fragranceType
    // Products with no price data yet ("precio pendiente") are excluded from
    // the price slider, not zeroed out into it.
    const matchesPrice = p.priceStatus === 'pending' || (p.price >= minPrice && p.price <= maxPrice)

    return matchesSearch && matchesCategory && matchesGender && matchesType && matchesPrice
  })

  if (sort === 'price_asc' || sort === 'price_desc') {
    // Pending-price products have no real price to rank by, so they sink to
    // the end of the list regardless of sort direction.
    filtered.sort((a, b) => {
      if (a.priceStatus === 'pending' && b.priceStatus === 'pending') return 0
      if (a.priceStatus === 'pending') return 1
      if (b.priceStatus === 'pending') return -1
      return sort === 'price_asc' ? a.price - b.price : b.price - a.price
    })
  }

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)

  return NextResponse.json({
    products: pageItems,
    total,
    page,
    pageSize,
    totalPages,
    facets: { categories, genders, fragranceTypes },
  })
}
