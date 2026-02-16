import { Product } from '../types/product'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { buttonVariants } from './ui/buttonVariants'
import { formatPrice, cn } from '../lib/utils'
import { Edit, Trash } from 'lucide-react'
import { Skeleton } from './ui/Skeleton'

interface ProductCardProps {
  product: Product
  onDelete?: (id: number) => void
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 bg-white group/card">
      <div className="relative aspect-[4/3] w-full bg-white p-6 flex items-center justify-center overflow-hidden border-b border-slate-100">
        <Link to={`/product/${product.id}`} className="contents">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-full w-auto object-contain transition-transform duration-500 group-hover/card:scale-110 cursor-pointer mix-blend-multiply"
            loading="lazy"
          />
        </Link>
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 shadow-sm bg-white/90 backdrop-blur-sm"
        >
          {product.category}
        </Badge>
      </div>

      <CardHeader className="p-5 pb-0">
        <Link
          to={`/product/${product.id}`}
          className="hover:text-primary transition-colors"
        >
          <h3
            className="text-base font-semibold leading-snug line-clamp-2 min-h-[2.5rem] tracking-tight text-slate-800"
            title={product.title}
          >
            {product.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="p-5 flex-grow flex flex-col justify-end">
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            <span className="text-yellow-500 mr-1 text-sm">★</span>
            {product.rating?.rate}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 gap-3">
        <Link
          to={`/product/${product.id}/edit`}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'flex-1 border-slate-200 hover:border-sidebar-primary hover:text-primary',
          )}
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete?.(product.id)}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <div className="h-48 w-full p-4">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="p-4 pb-0 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent className="p-4 mt-auto">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  )
}
