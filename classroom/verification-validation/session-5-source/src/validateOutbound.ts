import { exceedsStock, isNonPositiveQuantity, maximumDecimalPlaces, requiresWholeNumber } from './mutationAdapter'
import { decimalPlaces } from './quantityRules'
import type { OutboundValidationResult } from './types'

export function validateOutbound(stock: number, amount: number, unit: string, isActive = true): OutboundValidationResult {
  if (!isActive) return { accepted: false, nextStock: stock, reason: 'ARCHIVED_ITEM' }
  if (!Number.isFinite(amount) || isNonPositiveQuantity(amount)) {
    return { accepted: false, nextStock: stock, reason: 'INVALID_QUANTITY' }
  }
  if (decimalPlaces(amount) > maximumDecimalPlaces()) {
    return { accepted: false, nextStock: stock, reason: 'PRECISION_EXCEEDED' }
  }
  if (requiresWholeNumber(unit) && !Number.isInteger(amount)) {
    return { accepted: false, nextStock: stock, reason: 'WHOLE_UNIT_REQUIRED' }
  }
  if (exceedsStock(amount, stock)) {
    return { accepted: false, nextStock: stock, reason: 'INSUFFICIENT_STOCK' }
  }
  return { accepted: true, nextStock: stock - amount, reason: 'OK' }
}
