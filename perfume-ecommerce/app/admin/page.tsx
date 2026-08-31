'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Order } from '@/lib/types'
import { loadOverrides, countDeltas } from '@/lib/adminStore'

interface Stats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[]
    const overrides = loadOverrides()

    fetch('/api/products?page=1&pageSize=1')
      .then((res) => res.json())
      .then((json: { total: number }) => {
        setStats({
          totalProducts: json.total + countDeltas(overrides),
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, o) => sum + o.total + o.tax, 0),
          pendingOrders: orders.filter((o) => o.status === 'pending').length,
        })
      })
      .catch(() => {
        setStats({
          totalProducts: countDeltas(overrides),
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, o) => sum + o.total + o.tax, 0),
          pendingOrders: orders.filter((o) => o.status === 'pending').length,
        })
      })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Productos" value={stats ? stats.totalProducts.toLocaleString() : '…'} />
        <StatCard label="Total Órdenes" value={stats ? stats.totalOrders.toLocaleString() : '…'} />
        <StatCard label="Ingresos Totales" value={stats ? `$${stats.totalRevenue.toFixed(2)}` : '…'} />
        <StatCard label="Órdenes Pendientes" value={stats ? stats.pendingOrders.toLocaleString() : '…'} highlight={!!stats && stats.pendingOrders > 0} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products?admin=true"
          className="block border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition"
        >
          <h2 className="text-xl font-bold mb-1">Gestionar Productos</h2>
          <p className="text-sm text-gray-600">Ver, editar, agregar y eliminar productos del catálogo.</p>
        </Link>
        <Link
          href="/admin/orders?admin=true"
          className="block border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition"
        >
          <h2 className="text-xl font-bold mb-1">Gestionar Órdenes</h2>
          <p className="text-sm text-gray-600">Ver todas las órdenes y actualizar su estado.</p>
        </Link>
      </div>
    </div>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`border rounded-lg p-4 bg-white ${highlight ? 'border-amber-300' : 'border-gray-200'}`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-amber-600' : ''}`}>{value}</p>
    </div>
  )
}
