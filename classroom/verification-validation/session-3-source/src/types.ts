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

export interface QuantityValidation {
  valid: boolean
  reason?: string
}

export interface UsageProfileEntry {
  activity: string
  frequencyPercent: number
}
