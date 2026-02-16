import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '../services/productService'
import { ProductInput } from '../types/product'

export const useProductMutations = () => {
  const queryClient = useQueryClient()

  const createProduct = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const updateProduct = useMutation({
    mutationFn: ({ id, product }: { id: number; product: ProductInput }) =>
      productService.updateProduct(id, product),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] })
    },
  })

  const deleteProduct = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const restoreProduct = useMutation({
    mutationFn: productService.restoreProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    restoreProduct,
  }
}

export const useCreateProduct = () => {
  const { createProduct } = useProductMutations()
  return createProduct
}

export const useUpdateProduct = () => {
  const { updateProduct } = useProductMutations()
  return updateProduct
}

export const useDeleteProduct = () => {
  const { deleteProduct } = useProductMutations()
  return deleteProduct
}

export const useRestoreProduct = () => {
  const { restoreProduct } = useProductMutations()
  return restoreProduct
}
