import { validateQuantity } from './quantityRules'
import type { InventoryItem, MovementResult } from './types'

export function applyOutbound(item: InventoryItem, amount: number): MovementResult {
  const previousStock = item.stock
  const reject = (reason: string): MovementResult => ({ accepted: false, previousStock, amount, nextStock: previousStock, reason })
  const quantityError = validateQuantity(item.unit, amount)
  if (quantityError) return reject(quantityError)
  if (amount > item.stock) return reject('Outbound quantity cannot exceed current stock.')
  return { accepted: true, previousStock, amount, nextStock: item.stock - amount }
}
