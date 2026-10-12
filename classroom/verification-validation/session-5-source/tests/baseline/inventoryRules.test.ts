import { describe, expect, it } from 'vitest'
import { applyOutbound } from '../../src/inventoryRules'
import { validateQuantity } from '../../src/quantityRules'
import type { InventoryItem } from '../../src/types'

const active: InventoryItem = { id: 'item-1', code: 'ITM-001', unit: 'pcs', stock: 10, state: 'ACTIVE' }

describe('official baseline: inventory rules', () => {
  it('rejects a zero outbound quantity (REQ-INV-001)', () => { expect(applyOutbound(active, 0).accepted).toBe(false) })
  it('rejects a fractional pcs quantity (REQ-INV-003)', () => { expect(validateQuantity('pcs', 1.5).valid).toBe(false) })
  it('rejects movement for an archived item (REQ-INV-005)', () => { expect(applyOutbound({ ...active, state: 'ARCHIVED' }, 1).accepted).toBe(false) })
  it('preserves the stock transition for a valid outbound (REQ-INV-006)', () => { expect(applyOutbound(active, 2)).toMatchObject({ accepted: true, previousStock: 10, amount: 2, nextStock: 8 }) })
})
