import { LucideIcon } from 'lucide-react'
import CountUp from 'react-countup'

interface MetricCardProps {
  label: string
  value: number
  icon: LucideIcon
  prefix?: string
  suffix?: string
  decimals?: number
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  prefix = '',
  suffix = '',
  decimals = 0,
}: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        {prefix}
        <CountUp end={value} decimals={decimals} duration={1.5} separator="." />
        {suffix}
      </h3>
    </div>
  )
}
