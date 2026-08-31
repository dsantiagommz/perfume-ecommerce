'use client'

import { useState, useEffect } from 'react'
import type { Product } from './types'

export interface CartItem extends Product {
  quantity: number
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      setCart(JSON.parse(saved))
    }
    setMounted(true)
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, mounted])

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    total,
    itemCount,
  }
}
