import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService'

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  })
}

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  })
}
