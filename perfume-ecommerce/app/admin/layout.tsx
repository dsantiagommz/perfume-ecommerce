'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'

// Mock gate only — no real authentication yet. Anyone can add ?admin=true.
function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isAdmin = searchParams.get('admin') === 'true'

  useEffect(() => {
    if (!isAdmin) router.replace('/')
  }, [isAdmin, router])

  if (!isAdmin) return null

  const navLink = (href: string, label: string) => (
    <Link
      href={`${href}?admin=true`}
      className={`px-3 py-1.5 rounded text-sm font-medium ${
        pathname === href ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <span className="text-lg font-bold">Admin Panel</span>
          <nav className="flex gap-2">
            {navLink('/admin', 'Dashboard')}
            {navLink('/admin/products', 'Productos')}
            {navLink('/admin/orders', 'Órdenes')}
          </nav>
        </div>
      </div>
      {children}
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  )
}
