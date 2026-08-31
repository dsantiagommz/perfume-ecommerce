import type { Product } from './types'
import productsData from './data/products.json'

export type { Product }

// Real wholesale catalog (5,836 products), replacing the old placeholder list.
// Loaded server-side only — import type-only from this module in client code
// to avoid bundling the full dataset (see app/api/products/route.ts for the
// client-facing, paginated way to read it).
export const products = productsData as Product[]

export const categories = [...new Set(products.map((p) => p.category))]
export const genders = [...new Set(products.map((p) => p.gender))]
export const fragranceTypes = [...new Set(products.map((p) => p.fragranceType).filter(Boolean))] as string[]
