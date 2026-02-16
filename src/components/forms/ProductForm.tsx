import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, ProductFormValues } from '../../schemas/productSchema'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Label } from '../ui/Label'
import { Product } from '../../types/product'
import { useEffect } from 'react'
import { useProducts } from '../../hooks/useProducts'

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: ProductFormValues) => void
  isSubmitting?: boolean
}

import { normalizeName, normalizeCategory } from '../../lib/normalization'
import { formatCategory } from '../../lib/formatters'
import { Select } from '../ui/Select'
import { useState } from 'react'


export function ProductForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) {
  const { data: products } = useProducts()
  const existingCategories = Array.from(new Set(products?.map(p => p.category) || [])).sort()
  const [isNewCategory, setIsNewCategory] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      price: 0,
      description: '',
      image: '',
      category: '',
      stock: 0,
    },
  })

  const formSubmit = (data: ProductFormValues) => {
    onSubmit({
      ...data,
      title: normalizeName(data.title),
      category: normalizeCategory(data.category)
    })
  }

  const imageUrl = watch('image')

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        price: initialData.price,
        description: initialData.description,
        image: initialData.image,
        category: initialData.category,
        stock: initialData.stock || 0,
      })
    }
  }, [initialData, reset])

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Produto</Label>
            <Input
              id="title"
              disabled={isSubmitting}
              {...register('title')}
              placeholder="Ex: Camiseta Premium Algodão"
              className="text-lg py-6"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  R$
                </span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  disabled={isSubmitting}
                  {...register('price', { valueAsNumber: true })}
                  placeholder="0.00"
                  className="pl-9"
                />
              </div>
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Estoque</Label>
              <Input
                id="stock"
                type="number"
                disabled={isSubmitting}
                {...register('stock', { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="category">Categoria</Label>
              <div className="flex flex-col gap-2">
                {!isNewCategory ? (
                  <div className="flex gap-2">
                    <Select
                      id="category"
                      disabled={isSubmitting}
                      {...register('category')}
                      onChange={(e) => {
                        if (e.target.value === 'NEW_CATEGORY') {
                          setIsNewCategory(true)
                          setValue('category', '')
                        } else {
                          register('category').onChange(e)
                        }
                      }}
                    >
                      <option value="">Selecione uma categoria</option>
                      {existingCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {formatCategory(cat)}
                        </option>
                      ))}
                      <option value="NEW_CATEGORY">+ Adicionar Nova Categoria...</option>
                    </Select>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="category"
                      autoFocus
                      disabled={isSubmitting}
                      {...register('category')}
                      placeholder="Nome da nova categoria"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsNewCategory(false)
                        setValue('category', '')
                      }}
                    >
                      Voltar
                    </Button>
                  </div>
                )}
              </div>
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição Detalhada</Label>
            <Textarea
              id="description"
              disabled={isSubmitting}
              {...register('description')}
              placeholder="Descreva as características principais do produto..."
              className="min-h-[150px] resize-none"
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Image Preview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image">URL da Imagem</Label>
            <Input
              id="image"
              disabled={isSubmitting}
              {...register('image')}
              placeholder="https://..."
            />
            {errors.image && (
              <p className="text-sm text-destructive">{errors.image.message}</p>
            )}
          </div>

          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl aspect-square flex items-center justify-center overflow-hidden relative group">
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Erro+na+Imagem'
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="text-white font-medium">Visualização</span>
                </div>
              </>
            ) : (
              <div className="text-center p-6 text-gray-400">
                <svg className="mx-auto h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Sem imagem</p>
                <p className="text-xs mt-1">Insira a URL acima</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[200px] h-11 text-base bg-teal-600 hover:bg-teal-700 shadow-sm"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Salvando...
            </span>
          ) : (
            initialData ? 'Salvar Alterações' : 'Criar Produto'
          )}
        </Button>
      </div>
    </form>
  )
}
