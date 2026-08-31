import type { Product } from '@/lib/types'

// The wholesale catalog has no product photos yet, so this renders a
// gender-tinted placeholder instead of a broken <img>.
const GENDER_STYLES: Record<Product['gender'], string> = {
  Men: 'from-slate-700 to-slate-900',
  Women: 'from-rose-400 to-rose-600',
  Unisex: 'from-violet-500 to-violet-700',
}

export function ProductImage({ product, className = '' }: { product: Product; className?: string }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} className={className} />
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${GENDER_STYLES[product.gender]} ${className}`}
    >
      <span className="text-3xl" aria-hidden="true">🧴</span>
    </div>
  )
}
