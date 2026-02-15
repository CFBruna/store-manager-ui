import { Product } from '../types/product'
import { Card, CardContent, CardFooter, CardHeader } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { formatPrice } from '../lib/utils'
import { Edit, Trash } from 'lucide-react'
import { Skeleton } from './ui/Skeleton'

interface ProductCardProps {
  product: Product
  onEdit?: (product: Product) => void
  onDelete?: (id: number) => void
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full bg-white p-4 flex items-center justify-center overflow-hidden group">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full w-auto object-contain transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <Badge variant="secondary" className="absolute top-2 right-2">
          {product.category}
        </Badge>
      </div>

      <CardHeader className="p-4 pb-0">
        <h3
          className="text-lg font-semibold leading-tight line-clamp-2 min-h-[3rem]"
          title={product.title}
        >
          {product.title}
        </h3>
      </CardHeader>

      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center text-sm text-slate-500">
            <span className="text-yellow-500 mr-1">★</span>
            {product.rating?.rate} ({product.rating?.count})
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onEdit?.(product)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <Button
          variant="destructive"
          size="icon"
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
