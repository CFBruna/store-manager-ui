import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Search, Plus } from 'lucide-react'
import { Product } from '../types/product'

export function Home() {
  const { data: products, isLoading, error } = useProducts()
  const [search, setSearch] = useState('')

  const filteredProducts = products?.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  )

  const handleEdit = (product: Product) => {
    console.log('Edit product:', product)
  }

  const handleDelete = (id: number) => {
    console.log('Delete product:', id)
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Store Manager
          </h1>
          <p className="text-slate-500">Gerencie seu catálogo de produtos</p>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            />
          </div>
          <Button className="font-semibold shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-lg border border-red-100 text-red-600">
          <p className="text-lg font-semibold">Erro ao carregar produtos</p>
          <p className="text-sm opacity-80">
            Por favor, tente recarregar a página.
          </p>
          <Button
            variant="outline"
            className="mt-4 border-red-200 hover:bg-red-100"
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : filteredProducts?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
        </div>
      )}

      {!isLoading && !error && filteredProducts?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
          <Search className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium text-slate-600">
            Nenhum produto encontrado
          </p>
          <p className="text-sm">Tente buscar por outro termo.</p>
        </div>
      )}
    </div>
  )
}
