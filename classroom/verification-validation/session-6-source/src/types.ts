export type ReleaseCandidate = 'RC1' | 'RC2'
export type InventoryUnit = 'pcs' | 'unit' | 'meter' | string

export interface InventoryItem {
  code: string
  name: string
  unit: InventoryUnit
  stock: number
}

export interface MovementResult {
  accepted: boolean
  previousStock: number
  amount: number
  nextStock: number
  reason?: string
}
