import { activeRelease } from './release'
import type { InventoryUnit } from './types'

export function validateQuantity(unit: InventoryUnit, amount: number): string | undefined {
  if (!Number.isFinite(amount)) return 'Quantity must be finite.'
  if (amount <= 0) return 'Quantity must be greater than zero.'
  if (decimalPlaces(amount) > 3) return 'Fractional quantity supports at most 3 decimal places.'
  const wholeNumberUnit = unit.toLowerCase() === 'pcs' || unit.toLowerCase() === 'unit'
  if (wholeNumberUnit && !Number.isInteger(amount) && activeRelease === 'RC2') {
    return 'Whole-number units require an integer quantity.'
  }
  return undefined
}

function decimalPlaces(value: number): number {
  const [coefficient = '', exponent = '0'] = value.toString().toLowerCase().split('e')
  const fractionDigits = coefficient.split('.')[1]?.length ?? 0
  return Math.max(0, fractionDigits - Number(exponent))
}
