'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
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
const STATUSES: Order['status'][] = ['pending', 'paid', 'shipped', 'delivered']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('orders') || '[]') as Order[]
    saved.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setOrders(saved)
    setMounted(true)
  }, [])

  const persist = (next: Order[]) => {
    setOrders(next)
    localStorage.setItem('orders', JSON.stringify(next))
  }

  const updateStatus = (id: string, status: Order['status']) => {
    persist(orders.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [orders, statusFilter, search])

  if (!mounted) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Órdenes</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por número de orden o cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-2 rounded flex-1 bg-white"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                statusFilter === filter ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filter === 'all' ? 'Todas' : STATUS_LABELS[filter]}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 py-12">No hay órdenes todavía.</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-600 py-12">Ninguna orden coincide con los filtros.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="px-4 py-3 font-medium">ID Orden</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const isExpanded = expandedId === order.id
                return (
                  <Fragment key={order.id}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                      <td className="px-4 py-3">{order.customer.firstName} {order.customer.lastName}</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-medium">${(order.total + order.tax).toFixed(2)}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${STATUS_STYLES[order.status]}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <td colSpan={5} className="px-4 py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Contacto</p>
                              <p>{order.customer.email}</p>
                              <p>{order.customer.phone}</p>
                              <p className="text-xs text-gray-500 mt-3 mb-1">Envío</p>
                              <p>
                                {order.shipping.address}, {order.shipping.city}, {order.shipping.state}{' '}
                                {order.shipping.zip}, {order.shipping.country}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Artículos</p>
                              <div className="space-y-1">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
