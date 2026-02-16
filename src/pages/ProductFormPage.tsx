import { useNavigate, useParams } from 'react-router-dom'
import {
  useCreateProduct,
  useUpdateProduct,
} from '../hooks/useProductMutations'
import { useProduct } from '../hooks/useProducts'
import { ProductForm } from '../components/forms/ProductForm'
import { ProductFormValues } from '../schemas/productSchema'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'
import { buttonVariants } from '../components/ui/buttonVariants'

export function ProductFormPage() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()

  const { data: product, isLoading: isLoadingProduct } = useProduct(Number(id))

  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      if (isEditing) {
        await updateProduct.mutateAsync({ id: Number(id), product: data })
        toast.success('Produto atualizado com sucesso!')
      } else {
        await createProduct.mutateAsync(data)
        toast.success('Produto criado com sucesso!')
      }
      navigate('/')
    } catch {
      toast.error('Erro ao salvar produto. Tente novamente.')
    }
  }

  if (isEditing && isLoadingProduct) {
    return (
      <div className="container mx-auto p-8 text-center">
        Carregando formulário...
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <Link
          to="/"
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          {isEditing ? 'Editar Produto' : 'Novo Produto'}
        </h1>
      </div>

      <div className="bg-white p-8 rounded-xl border shadow-sm">
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isSubmitting={createProduct.isPending || updateProduct.isPending}
        />
      </div>
    </div>
  )
}
