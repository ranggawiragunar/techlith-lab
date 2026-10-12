import { activeVariant } from './variant'

export function isNonPositiveQuantity(amount: number): boolean {
  return activeVariant === 'M01' ? amount < 0 : amount <= 0
}
export function maximumDecimalPlaces(): number {
  return activeVariant === 'M04' ? 4 : 3
}
export function requiresWholeNumber(unit: string): boolean {
  const wholeNumberUnits = ['pcs', 'unit']
  return activeVariant !== 'M03' && wholeNumberUnits.includes(unit.toLowerCase())
}
export function exceedsStock(amount: number, stock: number): boolean {
  return activeVariant === 'M02' ? amount >= stock : amount > stock
}
