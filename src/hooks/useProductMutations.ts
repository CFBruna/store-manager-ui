import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '../services/productService'
import { Product, ProductInput } from '../types/product'

export const useProductMutations = () => {
  const queryClient = useQueryClient()

  const createProduct = useMutation({
    mutationFn: productService.createProduct,
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ['products'] })

      const previousProducts = queryClient.getQueryData<Product[]>(['products'])

      const optimisticProduct: Product = {
        ...newProduct,
        id: Math.random(),
        image: newProduct.image || 'https://via.placeholder.com/150',
      }

      queryClient.setQueryData<Product[]>(['products'], (old) => {
        return old ? [optimisticProduct, ...old] : [optimisticProduct]
      })

      return { previousProducts }
    },
    onError: (_err, _newProduct, context) => {
      queryClient.setQueryData(['products'], context?.previousProducts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const updateProduct = useMutation({
    mutationFn: ({ id, product }: { id: number; product: ProductInput }) =>
      productService.updateProduct(id, product),
    onMutate: async ({ id, product }) => {
      await queryClient.cancelQueries({ queryKey: ['products'] })
      await queryClient.cancelQueries({ queryKey: ['products', id] })

      const previousProducts = queryClient.getQueryData<Product[]>(['products'])
      const previousProductDetail = queryClient.getQueryData<Product>([
        'products',
        id,
      ])

      queryClient.setQueryData<Product[]>(['products'], (old) =>
        old?.map((p) => (p.id === id ? { ...p, ...product } : p)),
      )
      queryClient.setQueryData<Product>(['products', id], (old) =>
        old ? { ...old, ...product } : undefined,
      )

      return { previousProducts, previousProductDetail }
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(['products'], context?.previousProducts)
      if (context?.previousProductDetail) {
        queryClient.setQueryData(
          ['products', _variables.id],
          context.previousProductDetail,
        )
      }
    },
  })

  const deleteProduct = useMutation({
    mutationFn: productService.deleteProduct,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['products'] })

      const previousProducts = queryClient.getQueryData<Product[]>(['products'])

      queryClient.setQueryData<Product[]>(['products'], (old) =>
        old?.filter((p) => p.id !== id),
      )

      return { previousProducts }
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['products'], context?.previousProducts)
    },
  })

  return {
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
