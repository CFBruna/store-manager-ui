import { api } from '../lib/axios'
import { Product, ProductInput } from '../types/product'
import { normalizeName, normalizeCategory } from '../lib/normalization'

const EXCHANGE_RATE = 5.5

const LOCAL_PRODUCTS_KEY = 'store_manager_local_products'

const getLocalProducts = (): Product[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(LOCAL_PRODUCTS_KEY)
  return stored ? JSON.parse(stored) : []
}

const saveLocalProduct = (product: Product) => {
  const current = getLocalProducts()
  const updated = [product, ...current]
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated))
}

const updateLocalProduct = (id: number, updates: ProductInput) => {
  const current = getLocalProducts()
  const index = current.findIndex(p => p.id === id)
  if (index !== -1) {
    current[index] = { ...current[index], ...updates } as Product
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(current))
    return true
  }
  return false
}

const deleteLocalProduct = (id: number) => {
  const current = getLocalProducts()
  const filtered = current.filter(p => p.id !== id)
  if (filtered.length !== current.length) {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(filtered))
    return true
  }
  return false
}

const DELETED_PRODUCTS_KEY = 'store_manager_deleted_products'

const getDeletedProductIds = (): number[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(DELETED_PRODUCTS_KEY)
  return stored ? JSON.parse(stored) : []
}

const addDeletedProductId = (id: number) => {
  const current = getDeletedProductIds()
  if (!current.includes(id)) {
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify([...current, id]))
  }
}

const removeDeletedProductId = (id: number) => {
  const current = getDeletedProductIds()
  const filtered = current.filter(pid => pid !== id)
  if (filtered.length !== current.length) {
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(filtered))
    return true
  }
  return false
}

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const localProducts = getLocalProducts()
    const deletedIds = getDeletedProductIds()

    try {
      const { data } = await api.get<Product[]>('/products')

      const apiProducts = data
        .filter(p => !deletedIds.includes(p.id))
        .map(product => ({
          ...product,
          price: product.price * EXCHANGE_RATE,
          stock: product.stock ?? Math.floor(Math.random() * 100) + 1
        }))

      const validLocalProducts = localProducts.filter(p => !deletedIds.includes(p.id))

      return [...validLocalProducts, ...apiProducts]
    } catch (error) {
      console.error('Error fetching products:', error)
      return localProducts
    }
  },

  getProduct: async (id: number): Promise<Product> => {
    const local = getLocalProducts().find(p => p.id === id)
    if (local) return local

    const { data } = await api.get<Product>(`/products/${id}`)
    return {
      ...data,
      price: data.price * EXCHANGE_RATE,
      stock: data.stock ?? 10
    }
  },

  createProduct: async (product: ProductInput): Promise<Product> => {
    const { data } = await api.post<Product>('/products', product)

    const newProduct: Product = {
      ...data,
      id: Date.now(),
      title: normalizeName(product.title),
      price: product.price,
      description: product.description,
      image: product.image,
      category: normalizeCategory(product.category),
      stock: product.stock ?? 0
    }

    saveLocalProduct(newProduct)
    return newProduct
  },

  updateProduct: async (
    id: number,
    product: ProductInput,
  ): Promise<Product> => {
    const normalizedProduct = {
      ...product,
      title: normalizeName(product.title),
      category: normalizeCategory(product.category),
    }

    if (updateLocalProduct(id, normalizedProduct)) {
      return { id, ...normalizedProduct } as Product
    }
    const { data } = await api.put<Product>(`/products/${id}`, normalizedProduct)
    return { ...data, ...normalizedProduct } as Product
  },

  deleteProduct: async (id: number): Promise<Product> => {
    if (deleteLocalProduct(id)) {
      return { id } as Product
    }
    addDeletedProductId(id)

    try {
      await api.delete<Product>(`/products/${id}`)
    } catch (e) {
    }

    return { id } as Product
  },

  restoreProduct: async (product: Product): Promise<Product> => {
    if (removeDeletedProductId(product.id)) {
      return product
    }
    const currentLocal = getLocalProducts()
    if (!currentLocal.some(p => p.id === product.id)) {
      saveLocalProduct(product)
    }

    return product
  },
}
