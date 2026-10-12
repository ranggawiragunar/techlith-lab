import { describe, expect, it } from 'vitest'
import { outbound, createScenario, transition } from '../src/inventoryScenario'
import type { InventoryItem } from '../src/types'

const archived: InventoryItem = { id: 'item-1', code: 'ITM-001', unit: 'pcs', stock: 10, state: 'ARCHIVED' }

describe('official baseline: state orientation', () => {
  it('keeps a rejected archived movement from changing the scenario', () => {
    const scenario = createScenario(archived)
    const result = outbound(scenario, 1)
    expect(result.result.accepted).toBe(false)
    expect(result.scenario).toBe(scenario)
  })
  it('can read an empty history collection', () => {
    expect(transition(createScenario(archived), 'history')).toEqual([])
  })
})
