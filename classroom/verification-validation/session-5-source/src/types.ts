export type InventoryState = 'ACTIVE' | 'ARCHIVED'

export interface InventoryItem {
  id: string
  code: string
  unit: string
  stock: number
  state: InventoryState
}

export interface MovementResult {
  accepted: boolean
  previousStock: number
  amount: number
  nextStock: number
  reason?: string
}

export type OutboundReason = 'OK' | 'ARCHIVED_ITEM' | 'INVALID_QUANTITY' | 'PRECISION_EXCEEDED' | 'WHOLE_UNIT_REQUIRED' | 'INSUFFICIENT_STOCK'

export type OutboundValidationResult =
  | { accepted: true; nextStock: number; reason: 'OK' }
  | { accepted: false; nextStock: number; reason: Exclude<OutboundReason, 'OK'> }

export interface QuantityValidation {
  valid: boolean
  reason?: string
}

export interface UsageProfileEntry {
  activity: string
  frequencyPercent: number
}
