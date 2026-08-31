'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Product, PriceStatus } from '@/lib/types'
import {
  type AdminProduct,
  loadOverrides,
  applyOverrides,
  upsertEdit,
  createProduct,
  deleteProduct,
} from '@/lib/adminStore'

const PAGE_SIZE = 50

const PRICE_STATUS_LABELS: Record<PriceStatus, string> = {
  confirmed: 'Confirmado',
  retail_only: 'Solo retail',
  wholesale_only: 'Solo mayorista',
  pending: 'Precio pendiente',
}

interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

const BLANK: AdminProduct = {
  id: '',
  upc: '',
  sku: '',
  name: '',
  brand: '',
  category: '',
  gender: 'Unisex',
  fragranceType: null,
  sizeOz: null,
  price: 0,
  retailPrice: null,
  wholesalePrice: null,
  priceStatus: 'pending',
  image: null,
  description: '',
  stock: 0,
}

export default function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<ProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [overrides, setOverrides] = useState(() => loadOverrides())
  const [editing, setEditing] = useState<AdminProduct | null>(null)
  const [creating, setCreating] = useState(false)

  const refreshOverrides = () => setOverrides(loadOverrides())

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) })
    if (search) params.set('search', search)
    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((json: ProductsResponse) => setData(json))
      .finally(() => setLoading(false))
  }, [page, search])

  const rows = useMemo(() => applyOverrides(data?.products ?? [], overrides), [data, overrides])

  const createdRows = useMemo(() => {
    if (!search) return overrides.created
    const q = search.toLowerCase()
    return overrides.created.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
  }, [overrides.created, search])

  const handleDelete = (product: AdminProduct) => {
    if (!confirm(`¿Eliminar "${product.name}" del catálogo?`)) return
    deleteProduct(product.id)
    refreshOverrides()
  }

  const handleSave = (product: AdminProduct, isNew: boolean) => {
    if (isNew) {
      createProduct(product)
    } else {
      upsertEdit(product.id, product)
    }
    refreshOverrides()
    setEditing(null)
    setCreating(false)
  }

  const totalPages = data?.totalPages ?? 1

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="text-3xl font-bold">Productos</h1>
        <button
          onClick={() => setCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
        >
          + Agregar nuevo
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o marca..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1)
        }}
        className="w-full sm:w-96 border border-gray-300 p-2 rounded mb-6"
      />

      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-600">
              <th className="px-4 py-3 font-medium">ID (UPC)</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Precio mayorista</th>
              <th className="px-4 py-3 font-medium">Precio retail</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {createdRows.map((p) => (
              <ProductRow key={p.id} product={p} onEdit={() => setEditing(p)} onDelete={() => handleDelete(p)} isNew />
            ))}
            {rows.map((p) => (
              <ProductRow key={p.id} product={p} onEdit={() => setEditing(p)} onDelete={() => handleDelete(p)} />
            ))}
          </tbody>
        </table>

        {!loading && rows.length === 0 && createdRows.length === 0 && (
          <p className="text-center text-gray-600 py-12">No se encontraron productos.</p>
        )}
        {loading && <p className="text-center text-gray-600 py-12">Cargando…</p>}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 bg-white"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">Página {page} de {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 bg-white"
          >
            Siguiente
          </button>
        </div>
      )}

      {(editing || creating) && (
        <ProductForm
          product={editing ?? BLANK}
          isNew={creating}
          onCancel={() => {
            setEditing(null)
            setCreating(false)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function ProductRow({
  product,
  onEdit,
  onDelete,
  isNew,
}: {
  product: AdminProduct
  onEdit: () => void
  onDelete: () => void
  isNew?: boolean
}) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
      <td className="px-4 py-3 font-mono text-xs text-gray-500">
        {product.id}
        {isNew && <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-sans">Nuevo</span>}
      </td>
      <td className="px-4 py-3 font-medium">{product.name}</td>
      <td className="px-4 py-3 text-gray-600">{product.category}</td>
      <td className="px-4 py-3">{product.wholesalePrice != null ? `$${product.wholesalePrice.toFixed(2)}` : '—'}</td>
      <td className="px-4 py-3">
        {product.priceStatus === 'pending' ? (
          <span className="text-amber-600 font-medium">Precio pendiente</span>
        ) : product.retailPrice != null ? (
          `$${product.retailPrice.toFixed(2)}`
        ) : (
          '—'
        )}
      </td>
      <td className="px-4 py-3">{typeof product.stock === 'number' ? product.stock : '—'}</td>
      <td className="px-4 py-3">
        <div className="flex gap-3">
          <button onClick={onEdit} className="text-blue-600 hover:text-blue-700" title="Editar">
            ✏️
          </button>
          <button onClick={onDelete} className="text-red-600 hover:text-red-700" title="Eliminar">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  )
}

function ProductForm({
  product,
  isNew,
  onCancel,
  onSave,
}: {
  product: AdminProduct
  isNew: boolean
  onCancel: () => void
  onSave: (product: AdminProduct, isNew: boolean) => void
}) {
  const [form, setForm] = useState<AdminProduct>(product)

  const set = <K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.category) {
      alert('Nombre y categoría son obligatorios')
      return
    }
    const id = isNew ? form.upc || form.id || `ADMIN-${Date.now()}` : form.id
    onSave({ ...form, id, upc: form.upc || id }, isNew)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={onCancel}>
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">{isNew ? 'Agregar Producto' : 'Editar Producto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombre *">
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </Field>
            <Field label="Marca">
              <input
                value={form.brand}
                onChange={(e) => set('brand', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </Field>
            <Field label="Categoría *">
              <input
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </Field>
            <Field label="Género">
              <select
                value={form.gender}
                onChange={(e) => set('gender', e.target.value as Product['gender'])}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </Field>
            {isNew && (
              <Field label="UPC">
                <input
                  value={form.upc}
                  onChange={(e) => set('upc', e.target.value)}
                  placeholder="Autogenerado si se deja vacío"
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </Field>
            )}
            <Field label="SKU">
              <input
                value={form.sku}
                onChange={(e) => set('sku', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </Field>
            <Field label="Estado de precio">
              <select
                value={form.priceStatus}
                onChange={(e) => set('priceStatus', e.target.value as PriceStatus)}
                className="w-full border border-gray-300 p-2 rounded"
              >
                {(Object.keys(PRICE_STATUS_LABELS) as PriceStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {PRICE_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </Field>
            {form.priceStatus === 'pending' && (
              <p className="col-span-2 text-sm text-amber-600 font-medium -mt-2">
                Este producto se mostrará como &quot;Precio pendiente&quot; en la tienda.
              </p>
            )}
            <Field label="Precio mayorista">
              <input
                type="number"
                step="0.01"
                value={form.wholesalePrice ?? ''}
                onChange={(e) => set('wholesalePrice', e.target.value === '' ? null : Number(e.target.value))}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </Field>
            <Field label="Precio retail">
              <input
                type="number"
                step="0.01"
                value={form.retailPrice ?? ''}
                onChange={(e) => set('retailPrice', e.target.value === '' ? null : Number(e.target.value))}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </Field>
            <Field label="Precio (mostrado en tienda)">
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', Number(e.target.value))}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </Field>
            <Field label="Stock">
              <input
                type="number"
                value={form.stock ?? ''}
                onChange={(e) => set('stock', e.target.value === '' ? undefined : Number(e.target.value))}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </Field>
          </div>
          <Field label="Descripción">
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">{label}</span>
      {children}
    </label>
  )
}
