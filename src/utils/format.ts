export function formatQuantity(value: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }).format(value)
}
