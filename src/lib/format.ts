/**
 * Formats a monetary value in Botswana Pula (BWP)
 * Example:
 *  formatBWP(12500) -> "P12,500"
 *  formatBWP(12500, { withDecimals: true }) -> "P12,500.00"
 */
export function formatBWP(amount: number, options?: { withDecimals?: boolean }): string {
  const withDecimals = options?.withDecimals ?? false
  const formattedNumber = new Intl.NumberFormat('en-BW', {
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  }).format(amount)

  return `P${formattedNumber}`
}

export function calculateVAT(amount: number, rate = 0.14): { subtotal: number; vat: number; total: number } {
  const subtotal = amount
  const vat = Math.round(subtotal * rate * 100) / 100
  const total = subtotal + vat
  return { subtotal, vat, total }
}

export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
