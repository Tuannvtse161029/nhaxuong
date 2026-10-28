import { type HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

export function Badge({ children, variant = 'default', className, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300',
    info: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
