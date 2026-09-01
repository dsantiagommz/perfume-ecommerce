'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { signOut } from '@/lib/auth'
import { useLanguage } from '@/lib/i18n'

export default function AccountPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return <div className="flex flex-1 items-center justify-center py-24 font-mono text-sm text-[#6b6b68]">Loading…</div>
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <div className="text-center">
          <h1 className="font-serif text-3xl tracking-[0.1em] text-[#f5f3f0]">{t('myAccount')}</h1>
          <p className="mt-3 font-mono text-sm text-[#6b6b68]">Sign in to view your account.</p>
          <Link
            href="/login"
            className="mt-6 inline-block border border-[#b8860b] px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#b8860b] transition hover:bg-[#b8860b] hover:text-[#0a0a0a]"
          >
            {t('login')}
          </Link>
        </div>
      </div>
    )
  }

  const displayName = user.user_metadata?.name ?? user.email

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl tracking-[0.1em] text-[#f5f3f0]">{t('myAccount')}</h1>

      <div className="mt-8 border border-[#3a3a38] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center border border-[#b8860b] font-serif text-xl text-[#b8860b]">
            {String(displayName ?? '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-mono text-sm text-[#f5f3f0]">{displayName}</p>
            <p className="font-mono text-xs text-[#6b6b68]">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/orders" className="glow-gold border border-[#3a3a38] p-6 text-center transition">
          <p className="font-serif text-lg text-[#f5f3f0]">{t('orders')}</p>
          <p className="mt-1 font-mono text-xs text-[#6b6b68]">View order history</p>
        </Link>
        <Link href="/account/favorites" className="glow-gold border border-[#3a3a38] p-6 text-center transition">
          <p className="font-serif text-lg text-[#f5f3f0]">{t('favorites')}</p>
          <p className="mt-1 font-mono text-xs text-[#6b6b68]">Saved fragrances</p>
        </Link>
        <Link href="/account/settings" className="glow-gold border border-[#3a3a38] p-6 text-center transition">
          <p className="font-serif text-lg text-[#f5f3f0]">{t('settings')}</p>
          <p className="mt-1 font-mono text-xs text-[#6b6b68]">Profile & preferences</p>
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 w-full border border-[#6b6b68] px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-[#f5f3f0] transition hover:border-[#b8860b] hover:text-[#b8860b] sm:w-auto"
      >
        {t('logout')}
      </button>
    </div>
  )
}
