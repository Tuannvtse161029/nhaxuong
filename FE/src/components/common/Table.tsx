import type { ReactNode } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import type { TableColumn } from '@/types/common.types'
import { cn } from '@/utils/cn'

export interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  rowKey?: (item: T, index: number) => string | number
  onRowClick?: (item: T) => void
}

export function Table<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'Không có dữ liệu',
  rowKey = (_, idx) => idx,
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={String(col.key) || idx}
                style={{ width: col.width }}
                className={cn(
                  'px-6 py-3.5',
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right'
                )}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center">
                <LoadingSpinner text="Đang tải dữ liệu..." />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-slate-400 dark:text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowKey(row, rowIdx)}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  'transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={String(col.key) || colIdx}
                    className={cn(
                      'px-6 py-4 whitespace-nowrap',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right'
                    )}
                  >
                    {col.render
                      ? col.render(row, rowIdx)
                      : ((row as Record<string, unknown>)[col.key as string] as ReactNode) ?? '-'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
