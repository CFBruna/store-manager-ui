import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProducts'
import {
  useDeleteProduct,
  useRestoreProduct,
} from '../hooks/useProductMutations'
import { useFavorites } from '../contexts/FavoritesContext'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import {
  ArrowLeft,
  Edit,
  Trash,
  Package,
  Share2,
  Rotate3d,
  X,
  Star,
} from 'lucide-react'
import { formatPrice, cn } from '../lib/utils'
import { buttonVariants } from '../components/ui/buttonVariants'
import { toast } from 'sonner'
import { translateCategory } from '../lib/i18n'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/Dialog'
import { useState, useEffect } from 'react'

export function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const productId = Number(id)
  const { data: product, isLoading, error } = useProduct(productId)
  const deleteProduct = useDeleteProduct()
  const restoreProduct = useRestoreProduct()
  const { favorites, toggleFavorite } = useFavorites()
  const [is360Open, setIs360Open] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [isAutoRotate, setIsAutoRotate] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoRotate) {
      interval = setInterval(() => {
        setRotation((prev) => (prev + 1) % 360)
      }, 20)
    }
    return () => clearInterval(interval)
  }, [isAutoRotate])

  const isFavorite = favorites.has(productId)

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8 animate-pulse">
        <div className="h-10 w-32 bg-slate-200 rounded" />
        <div className="grid md:grid-cols-2 gap-12">
          <div className="h-[500px] bg-slate-200 rounded-xl" />
          <div className="space-y-6">
            <div className="h-8 w-1/2 bg-slate-200 rounded" />
            <div className="h-12 w-3/4 bg-slate-200 rounded" />
            <div className="h-24 w-full bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
          <Package className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            Produto não encontrado
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            O produto que você está procurando pode ter sido removido ou não
            existe mais.
          </p>
        </div>
        <Link to="/" className={cn(buttonVariants({ variant: 'default' }))}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a loja
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8">
      <nav className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
        <Link
          to="/"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'pl-0 text-slate-500 hover:text-primary transition-colors h-12 sm:h-auto',
          )}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Voltar para produtos</span>
          <span className="sm:hidden">Voltar</span>
        </Link>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 h-12 w-12 sm:h-10 sm:w-10"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div
          className="relative group cursor-pointer w-full"
          onClick={() => setIs360Open(true)}
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 md:p-12 flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] overflow-hidden relative">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-[250px] sm:max-h-[350px] lg:max-h-[400px] w-auto object-contain transition-transform duration-500 group-hover:scale-110"
            />

            {/* 360 Badge Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Rotate3d className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Ver em 360°
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(product.id)
            }}
            className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all text-slate-400 hover:text-yellow-400 z-10 h-12 w-12"
            aria-label="Favoritar"
          >
            <Star
              className={cn('w-6 h-6 transition-colors', {
                'fill-yellow-400 text-yellow-400': isFavorite,
              })}
            />
          </button>
        </div>

        {/* Right Column: Product Info */}
        <div className="space-y-6 sm:space-y-8 lg:pt-4 w-full">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Badge
                variant="secondary"
                className="uppercase tracking-wider font-semibold text-xs py-1 px-3"
              >
                {translateCategory(product.category)}
              </Badge>
              <div className="flex items-center gap-1 text-sm font-medium text-slate-500">
                <span className="text-amber-400 fill-amber-400">★</span>
                <span>{product.rating?.rate ?? '0.0'}</span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="underline decoration-slate-300 underline-offset-4 hidden sm:inline">
                  {product.rating?.count ?? 0} avaliações
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              {product.title}
            </h1>
          </div>

          <div className="border-t border-b border-slate-100 py-4 sm:py-6 space-y-4 sm:space-y-6">
            <div className="flex items-end gap-3 sm:gap-4">
              <span className="text-3xl sm:text-4xl font-bold text-slate-900">
                {formatPrice(product.price)}
              </span>
              {(product.stock ?? 0) > 0 && (
                <span className="text-xs sm:text-sm text-green-600 font-medium mb-2 bg-green-50 px-2 py-1 rounded-md">
                  Em estoque: {product.stock}
                </span>
              )}
            </div>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4 sm:space-y-6">
            {/* Admin Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link
                to={`/product/${product.id}/edit`}
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'w-full sm:flex-1 border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 h-12',
                )}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Produto
              </Link>

              <Button
                variant="ghost"
                className="w-full sm:flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 h-12"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash className="w-4 h-4 mr-2" />
                Excluir Produto
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Produto</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600">
              Tem certeza que deseja excluir o produto{' '}
              <strong>{product.title}</strong>?
              <br />
              Essa ação não pode ser desfeita.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                const productToRestore = { ...product }
                deleteProduct.mutate(Number(id))
                setIsDeleteDialogOpen(false)
                navigate('/')
                toast.success('Produto excluído', {
                  action: {
                    label: 'Desfazer',
                    onClick: () => {
                      restoreProduct.mutate(productToRestore)
                      toast.success('Produto restaurado com sucesso')
                    },
                  },
                  duration: 5000,
                })
              }}
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 360 View Modal */}
      <Dialog open={is360Open} onOpenChange={setIs360Open}>
        <DialogContent className="max-w-[95vw] lg:max-w-[60vw] h-[85vh] flex flex-col p-0 overflow-hidden bg-slate-50 border-none shadow-2xl">
          <DialogHeader className="p-6 border-b bg-white z-20 flex flex-row items-center justify-between shrink-0">
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <Rotate3d className="w-6 h-6 text-teal-600" />
              <span>Visualização 360°</span>
              <span className="text-xs font-normal text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full bg-slate-50">
                Simulação 3D
              </span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIs360Open(false)}
              className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>

          <div className="flex-1 flex flex-col items-center justify-center relative bg-gradient-to-b from-white to-slate-100">
            <div className="relative w-full h-full flex items-center justify-center perspective-[1000px] overflow-hidden">
              <div
                className="relative transition-transform duration-75 will-change-transform"
                style={{ transform: `rotateY(${rotation}deg)` }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-[50vh] w-auto object-contain drop-shadow-2xl"
                />
                {/* Reflection effect */}
                <img
                  src={product.image}
                  alt=""
                  className="max-h-[50vh] w-auto object-contain absolute top-full left-0 opacity-20 transform scale-y-[-1] mask-image-gradient"
                  style={{
                    maskImage:
                      'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
                  }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 space-y-4">
              <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                <span>Girar</span>
                <span className="text-teal-600 font-mono">{rotation}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => {
                  setRotation(Number(e.target.value))
                  setIsAutoRotate(false)
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 hover:accent-teal-500"
              />
              <div className="flex justify-center pt-2">
                <Button
                  variant={isAutoRotate ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setIsAutoRotate(!isAutoRotate)}
                  className={cn(
                    'gap-2',
                    isAutoRotate &&
                      'bg-teal-100 text-teal-700 hover:bg-teal-200',
                  )}
                >
                  <Rotate3d
                    className={cn('w-4 h-4', isAutoRotate && 'animate-spin')}
                  />
                  {isAutoRotate ? 'Parar Rotação' : 'Rotação Automática'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
