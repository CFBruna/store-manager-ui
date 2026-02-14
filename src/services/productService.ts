import { api } from '../lib/axios'
import { Product, ProductInput } from '../types/product'

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const { data } = await api.get<Product[]>('/products')
    return data
  },

  getProduct: async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`)
    return data
  },

  createProduct: async (product: ProductInput): Promise<Product> => {
    const { data } = await api.post<Product>('/products', product)
    return data
  },

  updateProduct: async (
    id: number,
    product: ProductInput,
  ): Promise<Product> => {
    const { data } = await api.put<Product>(`/products/${id}`, product)
    return data
  },

  deleteProduct: async (id: number): Promise<Product> => {
    const { data } = await api.delete<Product>(`/products/${id}`)
    return data
  },
}
