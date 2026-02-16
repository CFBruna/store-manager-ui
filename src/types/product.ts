export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  stock?: number
  rating?: {
    rate: number
    count: number
  }
}

export type ProductInput = Omit<Product, 'id' | 'rating'>
