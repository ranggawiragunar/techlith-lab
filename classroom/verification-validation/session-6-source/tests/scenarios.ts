import type { InventoryItem } from '../src/types'

export interface ExecutionScenario {
  id: string
  requirement: string
  item: InventoryItem
  amount: number
  accepted: boolean
  nextStock: number
}

const item = (unit: string, stock = 10): InventoryItem => ({ code: `ITM-${unit.toUpperCase()}`, unit, stock })

export const scenarios: ExecutionScenario[] = [
  { id: 'TC-INV-S6-001', requirement: 'REQ-INV-003 / REQ-INV-006', item: item('pcs'), amount: 1, accepted: true, nextStock: 9 },
  { id: 'TC-INV-S6-002', requirement: 'REQ-INV-003', item: item('pcs'), amount: 1.5, accepted: false, nextStock: 10 },
  { id: 'TC-INV-S6-003', requirement: 'REQ-INV-004 / REQ-INV-006', item: item('meter'), amount: 1.5, accepted: true, nextStock: 8.5 },
  { id: 'TC-INV-S6-004', requirement: 'REQ-INV-001', item: item('pcs'), amount: 0, accepted: false, nextStock: 10 },
  { id: 'TC-INV-S6-005', requirement: 'REQ-INV-001', item: item('pcs'), amount: -1, accepted: false, nextStock: 10 },
  { id: 'TC-INV-S6-006', requirement: 'REQ-INV-002', item: item('pcs'), amount: 11, accepted: false, nextStock: 10 },
]
