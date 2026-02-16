import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import {
  useDeleteProduct,
  useRestoreProduct,
} from '../hooks/useProductMutations'
import { useClickOutside } from '../hooks/useClickOutside'
import { ProductTable } from '../components/ProductTable'
import { Product } from '../types/product'
import { Input } from '../components/ui/Input'
import { Search, Plus, Filter, Download, X, Scan } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrice } from '../lib/utils'
import { Button } from '../components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/Dialog'
import {
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '../components/ui/DropdownMenu'
import { formatCategory } from '../lib/formatters'

export function Home() {
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [idsToDelete, setIdsToDelete] = useState<number[]>([])

  const { data: products, isLoading, error } = useProducts()
  const deleteProduct = useDeleteProduct()
  const restoreProduct = useRestoreProduct()
  const [search, setSearch] = useState('')
  const [showFiltersDialog, setShowFiltersDialog] = useState(false)
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  const filteredProducts = products?.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toString().includes(search)

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(p.category)

    const matchesPrice =
      (!priceRange.min || p.price >= parseFloat(priceRange.min)) &&
      (!priceRange.max || p.price <= parseFloat(priceRange.max))

    return matchesSearch && matchesCategory && matchesPrice
  })

  const handleDelete = (id: number) => {
    const product = products?.find((p) => p.id === id)
    if (product) {
      setProductToDelete(product)
    }
  }

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct.mutate(productToDelete.id)

      toast.success('Produto excluído', {
        action: {
          label: 'Desfazer',
          onClick: () => {
            setTimeout(() => {
              restoreProduct.mutate(productToDelete)
              toast.success('Ação desfeita')
            }, 500)
          },
        },
        duration: 5000,
      })

      setProductToDelete(null)
    }
  }

  const handleBulkDelete = (ids: number[]) => {
    setIdsToDelete(ids)
  }

  const confirmBulkDelete = () => {
    const productsRestorationMap = idsToDelete
      .map((id) => products?.find((p) => p.id === id))
      .filter(Boolean) as Product[]

    idsToDelete.forEach((id) => deleteProduct.mutate(id))

    toast.success(`${idsToDelete.length} produtos excluídos`, {
      action: {
        label: 'Desfazer',
        onClick: () => {
          setTimeout(() => {
            productsRestorationMap.forEach((p) => restoreProduct.mutate(p))
            toast.success('Ação desfeita')
          }, 500)
        },
      },
      duration: 5000,
    })

    setIdsToDelete([])
  }

  const stockValue =
    filteredProducts?.reduce((acc, p) => acc + p.price * (p.stock || 0), 0) || 0
  const stockCost = stockValue * 0.6
  const expectedProfit = stockValue - stockCost

  const lowStock =
    filteredProducts?.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) < 10)
      .length || 0
  const outOfStock =
    filteredProducts?.filter((p) => (p.stock || 0) === 0).length || 0
  const inStock =
    filteredProducts?.filter((p) => (p.stock || 0) >= 10).length || 0

  const categories = Array.from(
    new Set(products?.map((p) => p.category) || []),
  ).sort()

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange({ min: '', max: '' })
    setShowFiltersDialog(false)
  }

  const exportToCSV = () => {
    if (!filteredProducts || filteredProducts.length === 0) {
      toast.error('Nenhum produto para exportar')
      return
    }

    const headers = ['ID', 'Produto', 'Categoria', 'Preço']
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map((p) =>
        [p.id, `"${p.title}"`, p.category, p.price].join(','),
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `produtos_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast.success('Produtos exportados com sucesso!')
  }

  const activeFiltersCount =
    selectedCategories.length + (priceRange.min || priceRange.max ? 1 : 0)

  const categoriesDropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(categoriesDropdownRef, () => {
    setShowCategoriesDropdown(false)
  })

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Item ou código"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <Button
          variant="outline"
          className="gap-2 h-10 font-normal text-gray-600 border-gray-200"
          onClick={() => setShowFiltersDialog(true)}
        >
          <Filter className="w-4 h-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-teal-500 text-white text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>
        <div className="relative" ref={categoriesDropdownRef}>
          <Button
            variant="outline"
            className="gap-2 h-10 font-normal text-gray-600 border-gray-200"
            onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
          >
            <Filter className="w-4 h-4" />
            Categorias
            {selectedCategories.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-teal-500 text-white text-xs rounded-full">
                {selectedCategories.length}
              </span>
            )}
          </Button>
          {showCategoriesDropdown && (
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                >
                  {formatCategory(category)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          )}
        </div>
        <Button
          variant="outline"
          className="gap-2 h-10 font-normal text-gray-600 border-gray-200"
          onClick={exportToCSV}
        >
          <Download className="w-4 h-4" />
          Exportar
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 text-gray-400 border-gray-200"
          onClick={() => toast.info('Scanner de código de barras em breve!')}
        >
          <Scan className="w-5 h-5" />
        </Button>

        <Link to="/product/new">
          <Button className="h-10 bg-teal-500 hover:bg-teal-600 text-white font-medium px-6">
            <Plus className="w-5 h-5 mr-2" />
            Produto
          </Button>
        </Link>
      </div>

      {/* Inline Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-gray-50 p-4 rounded-xl">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Valor em estoque</p>
          <p className="text-base font-semibold text-gray-900">
            {formatPrice(stockValue)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Custo do estoque</p>
          <p className="text-base font-semibold text-gray-900">
            {formatPrice(stockCost)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Lucro previsto</p>
          <p className="text-base font-semibold text-gray-900">
            {formatPrice(expectedProfit)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Estoque baixo</p>
          <div className="flex items-baseline gap-2">
            <p className="text-base font-semibold text-gray-900">{lowStock}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
              ●
            </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Sem estoque</p>
          <div className="flex items-baseline gap-2">
            <p className="text-base font-semibold text-gray-900">
              {outOfStock}
            </p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
              ●
            </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Em estoque</p>
          <p className="text-base font-semibold text-gray-900">{inStock}</p>
        </div>
      </div>

      {/* Product Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Erro ao carregar produtos</p>
        </div>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <ProductTable
          products={filteredProducts}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
        />
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">Nenhum produto encontrado</p>
        </div>
      )}

      <Dialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Produto</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600">
              Tem certeza que deseja excluir o produto{' '}
              <strong>{productToDelete?.title}</strong>?
              <br />
              Essa ação não pode ser desfeita.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={idsToDelete.length > 0}
        onOpenChange={(open) => !open && setIdsToDelete([])}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Produtos</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600">
              Tem certeza que deseja excluir{' '}
              <strong>{idsToDelete.length}</strong> produtos selecionados?
              <br />
              Essa ação não pode ser desfeita.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIdsToDelete([])}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmBulkDelete}>
              Excluir Selecionados
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filters Dialog */}
      <Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Filtros Avançados</DialogTitle>
              <button
                onClick={() => setShowFiltersDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faixa de Preço
              </label>
              <div className="flex gap-3">
                <Input
                  type="number"
                  placeholder="Mínimo"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Máximo"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorias
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">
                      {formatCategory(category)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
            <Button
              className="bg-teal-500 hover:bg-teal-600"
              onClick={() => setShowFiltersDialog(false)}
            >
              Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
