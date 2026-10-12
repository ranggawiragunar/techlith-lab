import { validateQuantity } from './quantityRules'
import { exceedsStock, isNonPositiveQuantity, maximumDecimalPlaces, requiresWholeNumber } from './mutationAdapter'
import { decimalPlaces } from './quantityRules'
import type { InventoryItem, MovementResult, OutboundResult } from './types'

export function validateOutbound(stock: number, amount: number, unit: string, isActive = true): OutboundResult {
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

export function applyOutbound(item: InventoryItem, amount: number): MovementResult {
  const previousStock = item.stock
  const result = validateOutbound(item.stock, amount, item.unit, item.state === 'ACTIVE')
  const reasons: Record<Exclude<OutboundResult['reason'], 'OK'>, string> = {
    ARCHIVED_ITEM: 'Archived items cannot receive new movements.',
    INVALID_QUANTITY: validateQuantity(item.unit, amount).reason ?? 'Quantity must be greater than zero.',
    PRECISION_EXCEEDED: 'Quantity supports at most 3 decimal places.',
    WHOLE_UNIT_REQUIRED: 'Whole-number units require an integer quantity.',
    INSUFFICIENT_STOCK: 'Outbound quantity cannot exceed current stock.',
  }
  return result.accepted
    ? { accepted: true, previousStock, amount, nextStock: result.nextStock }
    : { accepted: false, previousStock, amount, nextStock: result.nextStock, reason: reasons[result.reason] }
}
