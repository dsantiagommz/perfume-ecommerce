export type PriceStatus = 'confirmed' | 'retail_only' | 'wholesale_only' | 'pending'

export interface Product {
  id: string // UPC
  upc: string
  sku: string
  name: string
  brand: string
  category: string
  gender: 'Men' | 'Women' | 'Unisex'
  fragranceType: string | null
  sizeOz: number | null
  price: number
  retailPrice: number | null
  wholesalePrice: number | null
  priceStatus: PriceStatus
  image: string | null
  description: string
}

export interface OrderItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  tax: number
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  shipping: {
    country: string
    address: string
    city: string
    state: string
    zip: string
  }
  status: 'pending' | 'paid' | 'shipped' | 'delivered'
  createdAt: string
}
