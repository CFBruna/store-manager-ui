import { Card } from './ui/Card'

export function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden animate-pulse">
      <div className="relative aspect-[4/3] w-full bg-slate-200 dark:bg-slate-700" />

      <div className="flex-1 p-4 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
      </div>

      <div className="p-4 pt-0 flex gap-2">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    </Card>
  )
}
