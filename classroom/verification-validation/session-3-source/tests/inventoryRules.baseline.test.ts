import { describe, expect, it } from 'vitest'
import { validateOutbound } from '../src/inventoryRules'

describe('official incomplete baseline: outbound reference', () => {
  it('accepts a normal whole-number outbound', () => {
    expect(validateOutbound(10, 1, 'pcs')).toEqual({ accepted: true, nextStock: 9, reason: 'OK' })
  })

  it('rejects outbound above current stock', () => {
    expect(validateOutbound(10, 11, 'pcs')).toEqual({ accepted: false, nextStock: 10, reason: 'INSUFFICIENT_STOCK' })
  })

  it('accepts a fractional meter quantity', () => {
    expect(validateOutbound(10, 1.5, 'meter')).toEqual({ accepted: true, nextStock: 8.5, reason: 'OK' })
  })

  it('rejects a movement for an archived item', () => {
    expect(validateOutbound(10, 1, 'pcs', false)).toEqual({ accepted: false, nextStock: 10, reason: 'ARCHIVED_ITEM' })
  })
})
