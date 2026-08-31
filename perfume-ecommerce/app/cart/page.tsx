'use client'

import { useCart } from '@/lib/useCart'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProductImage } from '@/components/ProductImage'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total } = useCart()
  const router = useRouter()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex gap-4">
                  <ProductImage product={item} className="w-32 h-40 rounded" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{item.brand}</p>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          className="w-12 text-center border border-gray-300 rounded"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">${item.price} each</p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${(total * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/products"
                className="block text-center text-blue-600 hover:text-blue-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
