import { isNonPositiveQuantity, maximumDecimalPlaces, requiresWholeNumber } from './mutationAdapter'
import type { QuantityValidation } from './types'

export const MAX_DECIMAL_PLACES = 3
export const WHOLE_NUMBER_UNITS = ['pcs', 'unit'] as const
export const FRACTIONAL_UNITS = ['meter'] as const

export function decimalPlaces(value: number): number {
  const [coefficient = '', exponent = '0'] = value.toString().toLowerCase().split('e')
  const fractionDigits = coefficient.split('.')[1]?.length ?? 0
  return Math.max(0, fractionDigits - Number(exponent))
}

export function validateQuantity(unit: string, amount: number): QuantityValidation {
  if (!Number.isFinite(amount)) return { valid: false, reason: 'Quantity must be finite.' }
  if (isNonPositiveQuantity(amount)) return { valid: false, reason: 'Quantity must be greater than zero.' }
  if (decimalPlaces(amount) > maximumDecimalPlaces()) {
    return { valid: false, reason: `Quantity supports at most ${maximumDecimalPlaces()} decimal places.` }
  }
  if (requiresWholeNumber(unit) && !Number.isInteger(amount)) {
    return { valid: false, reason: 'Whole-number units require an integer quantity.' }
  }
  return { valid: true }
}
