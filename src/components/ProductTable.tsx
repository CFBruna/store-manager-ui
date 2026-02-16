import { useState } from 'react'
import { Product } from '../types/product'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/Table'
import { Switch } from './ui/Switch'
import { Star, Edit2, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn, formatPrice } from '../lib/utils'
import { useFavorites } from '../hooks/useFavorites'
import { translateCategory } from '../lib/i18n'

interface ProductTableProps {
  products: Product[]
  onDelete: (id: number) => void
  onBulkDelete?: (ids: number[]) => void
  onBulkAction?: (ids: number[]) => void
  bulkActionLabel?: string
  bulkActionIcon?: React.ElementType
  bulkActionClass?: string
  onToggleFavorite?: (id: number) => void
  onSelectionChange?: (ids: number[]) => void
  selectedIds?: number[]
  customBulkActions?: React.ReactNode
}

export function ProductTable({
  products,
  onDelete,
  onBulkDelete,
  onBulkAction,
  bulkActionLabel = 'Excluir Selecionados',
  bulkActionIcon: BulkIcon = Trash2,
  bulkActionClass = 'text-red-600 hover:text-red-700',
  onToggleFavorite,
  onSelectionChange,
  selectedIds: externalSelectedIds,
  customBulkActions,
}: ProductTableProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [internalSelectedIds, setInternalSelectedIds] = useState<number[]>([])

  const selectedIds = externalSelectedIds ?? internalSelectedIds
  const setSelectedIds = (ids: number[]) => {
    if (externalSelectedIds === undefined) {
      setInternalSelectedIds(ids)
    }
    onSelectionChange?.(ids)
  }

  const handleToggleFavorite = (id: number) => {
    if (onToggleFavorite) {
      onToggleFavorite(id)
    } else {
      toggleFavorite(id)
    }
  }

  const [catalogStatus, setCatalogStatus] = useState<Record<number, boolean>>(
    {},
  )

  const handleCatalogToggle = (productId: number, checked: boolean) => {
    setCatalogStatus((prev) => ({ ...prev, [productId]: checked }))
  }

  const toggleSelectAll = () => {
    let newIds: number[] = []
    if (selectedIds.length !== products.length) {
      newIds = products.map((p) => p.id)
    }
    setSelectedIds(newIds)
  }

  const toggleSelectOne = (id: number) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id]
    setSelectedIds(newIds)
  }

  const handleBulkAction = () => {
    if (onBulkAction && selectedIds.length > 0) {
      onBulkAction(selectedIds)
      setSelectedIds([])
    } else if (onBulkDelete && selectedIds.length > 0) {
      onBulkDelete(selectedIds)
      setSelectedIds([])
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {selectedIds.length > 0 && (
        <div className="bg-teal-50 px-4 py-2 flex items-center justify-between border-b border-teal-100">
          <span className="text-sm text-teal-700 font-medium">
            {selectedIds.length} item(s) selecionado(s)
          </span>
          {customBulkActions ? (
            customBulkActions
          ) : (
            <button
              onClick={handleBulkAction}
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors min-h-[48px] px-4',
                bulkActionClass,
              )}
            >
              <BulkIcon className="w-4 h-4" />
              {bulkActionLabel}
            </button>
          )}
        </div>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-100">
        {products.map((product) => (
          <div
            key={product.id}
            className={cn(
              'p-4 flex gap-3 transition-colors',
              selectedIds.includes(product.id) && 'bg-teal-50/50',
            )}
          >
            {/* Checkbox */}
            <div className="flex-shrink-0 pt-1">
              <input
                type="checkbox"
                checked={selectedIds.includes(product.id)}
                onChange={() => toggleSelectOne(product.id)}
                className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
            </div>

            {/* Product Image */}
            <Link to={`/product/${product.id}`} className="flex-shrink-0">
              <img
                src={product.image}
                alt={product.title}
                className="w-20 h-20 object-contain bg-gray-50 rounded p-1"
              />
            </Link>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Link
                  to={`/product/${product.id}`}
                  className="font-medium text-gray-900 hover:text-teal-600 transition-colors line-clamp-2 flex-1"
                >
                  {product.title}
                </Link>
                <button
                  onClick={() => handleToggleFavorite(product.id)}
                  className="text-gray-400 hover:text-amber-500 transition-colors p-2 -mt-2 -mr-2 min-h-[48px] min-w-[48px] flex items-center justify-center"
                >
                  <Star
                    className={cn(
                      'w-5 h-5',
                      isFavorite(product.id) && 'fill-amber-500 text-amber-500',
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  {translateCategory(product.category)}
                </span>
                <span className="text-xs text-gray-500">ID: {product.id}</span>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  <span
                    className={cn(
                      'text-sm',
                      (product.stock || 0) < 10 && 'text-amber-600 font-medium',
                      (product.stock || 0) === 0 && 'text-red-600 font-bold',
                    )}
                  >
                    Estoque: {product.stock ?? 0}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    to={`/product/${product.id}/edit`}
                    className="p-3 text-gray-400 hover:text-teal-600 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
                  >
                    <Edit2 className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-3 text-gray-400 hover:text-red-600 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <Switch
                  checked={catalogStatus[product.id] ?? true}
                  onCheckedChange={(checked) =>
                    handleCatalogToggle(product.id, checked)
                  }
                />
                <span className="text-xs text-gray-500">
                  Catálogo:{' '}
                  {(catalogStatus[product.id] ?? true) ? 'Sim' : 'Não'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === products.length &&
                    products.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Catálogo</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                className={cn(
                  selectedIds.includes(product.id) &&
                    'bg-teal-50/50 hover:bg-teal-50',
                )}
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product.id)}
                    onChange={() => toggleSelectOne(product.id)}
                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleToggleFavorite(product.id)}
                    className="text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    <Star
                      className={cn(
                        'w-5 h-5',
                        isFavorite(product.id) &&
                          'fill-amber-500 text-amber-500',
                      )}
                    />
                  </button>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/product/${product.id}`}
                    className="flex items-center gap-3 hover:text-teal-600 transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 object-contain bg-gray-50 rounded p-1"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.title}
                      </p>
                      <p className="text-xs text-gray-500">ID: {product.id}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {translateCategory(product.category)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'text-gray-900',
                      (product.stock || 0) < 10 && 'text-amber-600 font-medium',
                      (product.stock || 0) === 0 && 'text-red-600 font-bold',
                    )}
                  >
                    {product.stock ?? 0}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={catalogStatus[product.id] ?? true}
                      onCheckedChange={(checked) =>
                        handleCatalogToggle(product.id, checked)
                      }
                    />
                    <span className="text-xs text-gray-500 w-8 inline-block">
                      {(catalogStatus[product.id] ?? true) ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/product/${product.id}/edit`}
                      className="p-1.5 text-gray-400 hover:text-teal-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
