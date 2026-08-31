import { NextResponse } from 'next/server'
import { products } from '@/lib/mockData'

// id is the product's UPC (see lib/data/products.json). Swap the lookup for
// a `supabase.from('products').eq('upc', id)` query once that's wired up.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = products.find((p) => p.id === id)

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json({ product })
}
