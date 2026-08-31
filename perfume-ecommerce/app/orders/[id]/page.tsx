'use client'

import { useEffect, useState, use } from 'react'
import { Order } from '@/lib/types'
import { useCart } from '@/lib/useCart'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [order, setOrder] = useState<Order | null | undefined>(undefined)
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const foundOrder = orders.find((o: Order) => o.id === resolvedParams.id)
    setOrder(foundOrder ?? null)
  }, [resolvedParams.id])

  if (order === undefined) return null

  if (order === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <Link href="/orders" className="text-blue-600 hover:text-blue-700">
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  const buyAgain = (item: Order['items'][number]) => {
    addToCart(item, item.quantity)
    router.push('/cart')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/orders" className="text-sm text-blue-600 hover:text-blue-700">
          ← Back to Orders
        </Link>

        <div className="flex items-center justify-between flex-wrap gap-3 mt-4 mb-8">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLES[order.status]}`}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-lg font-bold">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="text-lg font-bold">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg">{order.customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-lg font-bold">${(order.total + order.tax).toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <p className="text-gray-700">
              {order.customer.firstName} {order.customer.lastName}<br />
              {order.shipping.address}<br />
              {order.shipping.city}, {order.shipping.state} {order.shipping.zip}<br />
              {order.shipping.country}
            </p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-4 pb-4 border-b last:border-b-0">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.brand}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right space-y-2">
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => buyAgain(item)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Buy Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Total</span>
              <span>${(order.total + order.tax).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
