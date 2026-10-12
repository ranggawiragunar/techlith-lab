import { validateQuantity } from './quantityRules'
import type { InventoryItem, MovementResult } from './types'

export function applyOutbound(item: InventoryItem, amount: number): MovementResult {
  const previousStock = item.stock
  const rejected = (reason: string): MovementResult => ({ accepted: false, previousStock, amount, nextStock: previousStock, reason })

  if (item.state !== 'ACTIVE') return rejected('Archived items cannot receive new movements.')
  const quantity = validateQuantity(item.unit, amount)
  if (!quantity.valid) return rejected(quantity.reason ?? 'Invalid quantity.')
  if (amount > item.stock) return rejected('Outbound quantity cannot exceed current stock.')

  return { accepted: true, previousStock, amount, nextStock: previousStock - amount }
}
