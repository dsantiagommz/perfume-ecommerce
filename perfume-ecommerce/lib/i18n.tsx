'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Locale = 'en' | 'es'

// Small shared-string dictionary for chrome that appears on every page
// (Navbar/Footer/Home). Page-level content can grow its own dictionaries
// later under Feature 8 without touching this shape.
const dictionary = {
  en: {
    home: 'Home',
    products: 'Products',
    about: 'About',
    contact: 'Contact',
    searchPlaceholder: 'Search perfumes...',
    account: 'Account',
    login: 'Login',
    cart: 'Cart',
    shopNow: 'Shop Now',
    heroTitle: 'Discover Your Signature Scent',
    heroSubtitle: 'Curated fragrances for every story, from timeless classics to modern icons.',
    featured: 'Featured Fragrances',
    shopByCategory: 'Shop by Category',
    men: "Men's",
    women: "Women's",
    unisex: 'Unisex',
    newsletterTitle: 'Stay in the Know',
    newsletterSubtitle: 'Subscribe for early access to new arrivals and exclusive offers.',
    newsletterPlaceholder: 'Your email address',
    subscribe: 'Subscribe',
    testimonialsTitle: 'What Our Customers Say',
    footerAbout: 'About',
    footerContact: 'Contact',
    footerPrivacy: 'Privacy',
    footerTerms: 'Terms',
    footerShipping: 'Shipping',
    footerReturns: 'Returns',
    rightsReserved: 'All rights reserved.',
    orders: 'Orders',
    favorites: 'Favorites',
    settings: 'Settings',
    logout: 'Log out',
    myAccount: 'My Account',
  },
  es: {
    home: 'Inicio',
    products: 'Productos',
    about: 'Nosotros',
    contact: 'Contacto',
    searchPlaceholder: 'Buscar perfumes...',
    account: 'Cuenta',
    login: 'Iniciar sesión',
    cart: 'Carrito',
    shopNow: 'Comprar Ahora',
    heroTitle: 'Descubre Tu Aroma Distintivo',
    heroSubtitle: 'Fragancias curadas para cada historia, de clásicos atemporales a íconos modernos.',
    featured: 'Fragancias Destacadas',
    shopByCategory: 'Comprar por Categoría',
    men: 'Hombre',
    women: 'Mujer',
    unisex: 'Unisex',
    newsletterTitle: 'Mantente Informado',
    newsletterSubtitle: 'Suscríbete para acceso anticipado a novedades y ofertas exclusivas.',
    newsletterPlaceholder: 'Tu correo electrónico',
    subscribe: 'Suscribirse',
    testimonialsTitle: 'Lo Que Dicen Nuestros Clientes',
    footerAbout: 'Nosotros',
    footerContact: 'Contacto',
    footerPrivacy: 'Privacidad',
    footerTerms: 'Términos',
    footerShipping: 'Envíos',
    footerReturns: 'Devoluciones',
    rightsReserved: 'Todos los derechos reservados.',
    orders: 'Órdenes',
    favorites: 'Favoritos',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
    myAccount: 'Mi Cuenta',
  },
} as const

export type TranslationKey = keyof typeof dictionary.en

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved === 'en' || saved === 'es') setLocaleState(saved)
  }, [])

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    localStorage.setItem('locale', next)
  }

  const t = (key: TranslationKey) => dictionary[locale][key]

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}
