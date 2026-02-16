import * as React from 'react'
import { cn } from '../../lib/utils'
import { Check } from 'lucide-react'

export interface DropdownMenuProps {
  children?: React.ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <div className="relative">{children}</div>
}

export function DropdownMenuTrigger({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

export function DropdownMenuContent({
  children,
  className,
  align = 'start',
}: {
  children: React.ReactNode
  className?: string
  align?: 'start' | 'end'
}) {
  return (
    <div
      className={cn(
        'absolute z-50 mt-2 min-w-[200px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg',
        align === 'end' ? 'right-0' : 'left-0',
        className,
      )}
      role="menu"
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'px-3 py-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer transition-colors',
        className,
      )}
      role="menuitem"
    >
      {children}
    </div>
  )
}

export function DropdownMenuCheckboxItem({
  children,
  checked,
  onCheckedChange,
}: {
  children: React.ReactNode
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <div
      role="menuitemcheckbox"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
    >
      <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
        {checked && <Check className="w-3 h-3 text-teal-600" />}
      </div>
      {children}
    </div>
  )
}
