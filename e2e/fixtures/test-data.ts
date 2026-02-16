export interface TestProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  stock: number
  cost: number
}

export function generateTestProduct(
  override?: Partial<Omit<TestProduct, 'id'>>,
): Omit<TestProduct, 'id'> {
  const timestamp = Date.now()
  return {
    title: `Test Product ${timestamp}`,
    price: 99.99,
    description: 'Test product description for E2E testing',
    category: 'electronics',
    image: 'https://picsum.photos/400/400',
    stock: 50,
    cost: 50.0,
    ...override,
  }
}

export function generateMultipleProducts(
  count: number,
): Omit<TestProduct, 'id'>[] {
  return Array.from({ length: count }, (_, i) =>
    generateTestProduct({
      title: `E2E Test Product ${Date.now()}-${i}`,
      price: (i + 1) * 10,
    }),
  )
}
