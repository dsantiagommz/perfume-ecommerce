'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { Order } from '@/lib/types'

type StatusFilter = 'all' | Order['status']

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Pending',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
}

const STATUS_STYLES: Record<Order['status'], string> = {
  pending: 'bg-gray-100 text-gray-700',
  paid: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
}

const FILTERS: StatusFilter[] = ['all', 'pending', 'paid', 'shipped', 'delivered']

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('orders') || '[]') as Order[]
    saved.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setOrders(saved)
    setMounted(true)
  }, [])

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()
    return orders.filter(order => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      const matchesSearch = !query || order.id.toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [orders, statusFilter, search])

  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, o) => sum + o.total + o.tax, 0)

  if (!mounted) return null

  if (totalOrders === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
          <p className="text-gray-600 mb-6">You haven&apos;t placed any orders.</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by order number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 p-2 rounded flex-1"
          />
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded text-sm font-medium ${
                  statusFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter === 'all' ? 'All' : STATUS_LABELS[filter]}
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders match your filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-bold">{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item
                      {order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold">${(order.total + order.tax).toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
