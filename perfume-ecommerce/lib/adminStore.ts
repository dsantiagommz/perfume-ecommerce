import type { Product } from './types'

// The real catalog (lib/data/products.json) is server-side only and read
// through /api/products. Admin edits/creates/deletes can't write back to
// that file, so they're layered on top as a localStorage "overrides" patch
// that the admin pages merge into whatever page of the catalog they fetch.
const OVERRIDES_KEY = 'admin_product_overrides'

export interface AdminProduct extends Product {
  stock?: number
}

export interface ProductOverrides {
  edited: Record<string, Partial<AdminProduct>>
  created: AdminProduct[]
  deletedIds: string[]
}

const EMPTY_OVERRIDES: ProductOverrides = { edited: {}, created: [], deletedIds: [] }

export function loadOverrides(): ProductOverrides {
  if (typeof window === 'undefined') return EMPTY_OVERRIDES
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY)
    if (!raw) return EMPTY_OVERRIDES
    const parsed = JSON.parse(raw)
    return {
      edited: parsed.edited ?? {},
      created: parsed.created ?? [],
      deletedIds: parsed.deletedIds ?? [],
    }
  } catch {
    return EMPTY_OVERRIDES
  }
}

function saveOverrides(overrides: ProductOverrides) {
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides))
}

export function upsertEdit(id: string, patch: Partial<AdminProduct>) {
  const overrides = loadOverrides()
  const createdIndex = overrides.created.findIndex((p) => p.id === id)
  if (createdIndex !== -1) {
    overrides.created[createdIndex] = { ...overrides.created[createdIndex], ...patch }
  } else {
    overrides.edited[id] = { ...overrides.edited[id], ...patch }
  }
  saveOverrides(overrides)
}

export function createProduct(product: AdminProduct) {
  const overrides = loadOverrides()
  overrides.created.push(product)
  saveOverrides(overrides)
}

export function deleteProduct(id: string) {
  const overrides = loadOverrides()
  overrides.created = overrides.created.filter((p) => p.id !== id)
  delete overrides.edited[id]
  if (!overrides.deletedIds.includes(id)) overrides.deletedIds.push(id)
  saveOverrides(overrides)
}

// Merge a fetched page of catalog products with local edits/deletions.
// Does not inject `created` products — callers show those separately since
// they don't belong to any server-side page.
export function applyOverrides(products: Product[], overrides: ProductOverrides): AdminProduct[] {
  return products
    .filter((p) => !overrides.deletedIds.includes(p.id))
    .map((p) => (overrides.edited[p.id] ? { ...p, ...overrides.edited[p.id] } : p))
}

export function countDeltas(overrides: ProductOverrides) {
  return overrides.created.length - overrides.deletedIds.length
}
