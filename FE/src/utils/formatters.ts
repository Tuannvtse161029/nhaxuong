/**
 * Format currency (VND / USD)
 */
export function formatCurrency(amount: number, currency: 'VND' | 'USD' = 'VND'): string {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

/**
 * Format date string to Vietnamese localized format
 */
export function formatDate(date: string | Date | number): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

/**
 * Format date time string
 */
export function formatDateTime(date: string | Date | number): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}
