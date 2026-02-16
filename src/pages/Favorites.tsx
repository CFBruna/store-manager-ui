import { useState } from 'react'
import { useFavorites } from '../contexts/FavoritesContext'
import { useProducts } from '../hooks/useProducts'
import { useDeleteProduct, useRestoreProduct } from '../hooks/useProductMutations'
import { ProductTable } from '../components/ProductTable'
import { Product } from '../types/product'
import { EmptyState } from '../components/EmptyState'
import { ProductCardSkeleton } from '../components/ProductCardSkeleton'
import { Star, Trash2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../components/ui/Dialog'
import { Button } from '../components/ui/Button'

export function Favorites() {
    const { favorites, removeFavorites, addFavorites } = useFavorites()
    const { data: products, isLoading } = useProducts()
    const deleteProduct = useDeleteProduct()
    const restoreProduct = useRestoreProduct()

    const [productToDelete, setProductToDelete] = useState<Product | null>(null)
    const [idsToRemove, setIdsToRemove] = useState<number[]>([])
    const [showBulkRemoveConfirm, setShowBulkRemoveConfirm] = useState(false)

    const favoriteProducts = products?.filter((product) =>
        favorites.has(product.id)
    )

    const handleBulkRemoveFormFavorites = () => {
        const idsToRestore = [...idsToRemove]
        const count = idsToRemove.length
        removeFavorites(idsToRemove)

        const message = count === 1
            ? '1 produto removido dos favoritos'
            : `${count} produtos removidos dos favoritos`

        toast.success(message, {
            action: {
                label: 'Desfazer',
                onClick: () => {
                    addFavorites(idsToRestore)
                    setIdsToRemove(idsToRestore)
                    toast.success('Ação desfeita')
                },
            },
            duration: 5000,
        })

        setIdsToRemove([])
        setShowBulkRemoveConfirm(false)
    }

    const handleDeleteFromSystem = (id: number) => {
        const product = products?.find((p) => p.id === id)
        if (product) {
            setProductToDelete(product)
        }
    }

    const confirmDeleteFromSystem = () => {
        if (productToDelete) {
            deleteProduct.mutate(productToDelete.id)
            toast.success('Produto excluído do sistema', {
                action: {
                    label: 'Desfazer',
                    onClick: () => {
                        setTimeout(() => {
                            restoreProduct.mutate(productToDelete)
                            toast.success('Ação desfeita')
                        }, 500)
                    },
                },
            })
            setProductToDelete(null)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Produtos Favoritos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        )
    }

    if (!favoriteProducts || favoriteProducts.length === 0) {
        return (
            <EmptyState
                icon={Star}
                title="Nenhum favorito ainda"
                description="Adicione produtos aos favoritos clicando no ícone de estrela para vê-los aqui."
            />
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Produtos Favoritos</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {favoriteProducts.length} produto(s) na sua lista
                    </p>
                </div>
            </div>

            <ProductTable
                products={favoriteProducts}
                selectedIds={idsToRemove}
                onSelectionChange={setIdsToRemove}
                onDelete={handleDeleteFromSystem}
                customBulkActions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setShowBulkRemoveConfirm(true)}
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Remover dos Favoritos ({idsToRemove.length})
                        </Button>
                    </div>
                }
            />

            {/* Dialog para excluir do sistema */}
            <Dialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Você tem certeza que quer excluir "{productToDelete?.title}"?</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 py-4">
                        Esta ação excluirá permanentemente o produto do seu inventário.
                        Você poderá desfazer esta ação logo em seguida.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setProductToDelete(null)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteFromSystem}>
                            Excluir do Sistema
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog para remover em massa dos favoritos */}
            <Dialog open={showBulkRemoveConfirm} onOpenChange={setShowBulkRemoveConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {idsToRemove.length === 1
                                ? `Remover dos favoritos?`
                                : `Remover selecionados dos favoritos?`
                            }
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-gray-600 py-4">
                        {idsToRemove.length === 1 ? (
                            <p>
                                Você tem certeza que quer remover <strong>"{favoriteProducts?.find(p => p.id === idsToRemove[0])?.title}"</strong> dos favoritos?
                            </p>
                        ) : (
                            <>
                                <p className="mb-2">Você tem certeza que quer remover os <strong>{idsToRemove.length}</strong> produtos selecionados dos favoritos?</p>
                                <ul className="list-disc list-inside text-sm max-h-32 overflow-y-auto mt-2 bg-gray-50 p-2 rounded border border-gray-100">
                                    {favoriteProducts?.filter(p => idsToRemove.includes(p.id)).map(p => (
                                        <li key={p.id} className="truncate">{p.title}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                        <p className="mt-4 text-xs text-gray-500 italic">
                            O(s) produto(s) continuarão existindo no sistema.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowBulkRemoveConfirm(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleBulkRemoveFormFavorites}>
                            Remover dos Favoritos
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
