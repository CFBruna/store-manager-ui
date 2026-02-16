import { api } from '../lib/axios'
import { Product, ProductInput } from '../types/product'
import { normalizeName, normalizeCategory } from '../lib/normalization'
import { translateProduct } from '../lib/i18n'

const EXCHANGE_RATE = 5.5

const LOCAL_PRODUCTS_KEY = 'store_manager_local_products'

const getLocalProducts = (): Product[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(LOCAL_PRODUCTS_KEY)
  return stored ? JSON.parse(stored) : []
}

const saveLocalProduct = (product: Product) => {
  const current = getLocalProducts()
  // If it's an override, replace the existing one
  const index = current.findIndex((p) => p.id === product.id)
  let updated
  if (index !== -1) {
    updated = [...current]
    updated[index] = product
  } else {
    updated = [product, ...current]
  }
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated))
}

const deleteLocalProduct = (id: number) => {
  const current = getLocalProducts()
  const filtered = current.filter((p) => p.id !== id)
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
  const filtered = current.filter((pid) => pid !== id)
  if (filtered.length !== current.length) {
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(filtered))
    return true
  }
  return false
}

const getPersistentStock = (id: number): number => {
  const stockKey = `stock_persistent_${id}`
  const stored = localStorage.getItem(stockKey)
  if (stored) return parseInt(stored, 10)

  // Deterministic seed based on id to keep it consistent without random
  const seed = ((id * 1597) % 100) + 1
  localStorage.setItem(stockKey, seed.toString())
  return seed
}

const savePersistentStock = (id: number, stock: number) => {
  const stockKey = `stock_persistent_${id}`
  localStorage.setItem(stockKey, stock.toString())
}

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const localProducts = getLocalProducts()
    const deletedIds = getDeletedProductIds()

    try {
      const { data } = await api.get<Product[]>('/products')

      const apiProducts = data
        .filter((p) => !deletedIds.includes(p.id))
        // Filter out API products that have a local override
        .filter((p) => !localProducts.some((lp) => lp.id === p.id))
        .map((product) => {
          const { title, description } = translateProduct(
            product.id,
            product.title,
            product.description,
          )
          return {
            ...product,
            title,
            description,
            price: Number((product.price * EXCHANGE_RATE).toFixed(2)),
            stock: getPersistentStock(product.id),
          }
        })

      const validLocalProducts = localProducts.filter(
        (p) => !deletedIds.includes(p.id),
      )

      return [...validLocalProducts, ...apiProducts]
    } catch (error) {
      console.error('Error fetching products:', error)
      return localProducts
    }
  },

  getProduct: async (id: number): Promise<Product> => {
    const local = getLocalProducts().find((p) => p.id === id)
    if (local) return local

    const { data } = await api.get<Product>(`/products/${id}`)
    const { title, description } = translateProduct(
      data.id,
      data.title,
      data.description,
    )
    return {
      ...data,
      title,
      description,
      price: Number((data.price * EXCHANGE_RATE).toFixed(2)),
      stock: getPersistentStock(data.id),
    }
  },

  createProduct: async (product: ProductInput): Promise<Product> => {
    const { data } = await api.post<Product>('/products', product)

    const newProduct: Product = {
      ...data,
      id: Date.now(),
      title: normalizeName(product.title),
      price: Number(product.price.toFixed(2)),
      description: product.description,
      image: product.image,
      category: normalizeCategory(product.category),
      stock: product.stock ?? 0,
    }

    saveLocalProduct(newProduct)
    return newProduct
  },

  updateProduct: async (
    id: number,
    product: ProductInput,
  ): Promise<Product> => {
    // Get existing product to preserve rating, etc.
    const existing = await productService.getProduct(id)

    const normalizedProduct = {
      ...existing,
      ...product,
      id,
      title: normalizeName(product.title),
      category: normalizeCategory(product.category),
      price: Number(product.price.toFixed(2)),
    }

    // Sync persistent stock if modified
    if (normalizedProduct.stock !== undefined) {
      savePersistentStock(id, normalizedProduct.stock)
    }

    // Always save to local as an override
    saveLocalProduct(normalizedProduct as Product)

    try {
      await api.put<Product>(`/products/${id}`, normalizedProduct)
    } catch {
      // Ignore API errors as we manage state locally
    }

    return normalizedProduct as Product
  },

  deleteProduct: async (id: number): Promise<Product> => {
    if (deleteLocalProduct(id)) {
      addDeletedProductId(id)
      return { id } as Product
    }
    addDeletedProductId(id)

    try {
      await api.delete<Product>(`/products/${id}`)
    } catch {
      // Ignore API errors
    }

    return { id } as Product
  },

  restoreProduct: async (product: Product): Promise<Product> => {
    if (removeDeletedProductId(product.id)) {
      return product
    }
    const currentLocal = getLocalProducts()
    if (!currentLocal.some((p) => p.id === product.id)) {
      saveLocalProduct(product)
    }

    return product
  },
}
