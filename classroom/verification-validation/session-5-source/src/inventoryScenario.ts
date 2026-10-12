import { applyOutbound } from './inventoryRules'
import { archiveItem, restoreItem } from './inventoryState'
import type { InventoryItem, MovementResult } from './types'

export interface MovementRecord { previousStock: number; amount: number; nextStock: number }
export interface InventoryScenario { item: InventoryItem; history: MovementRecord[] }
export type ScenarioAction = 'archive' | 'restore' | 'history'

export function createScenario(item: InventoryItem): InventoryScenario {
  return { item: { ...item }, history: [] }
}

export function outbound(scenario: InventoryScenario, amount: number): { scenario: InventoryScenario; result: MovementResult } {
  const result = applyOutbound(scenario.item, amount)
  if (!result.accepted) return { scenario, result }
  return {
    scenario: {
      item: { ...scenario.item, stock: result.nextStock },
      history: [...scenario.history, { previousStock: result.previousStock, amount, nextStock: result.nextStock }],
    },
    result,
  }
}

export function transition(scenario: InventoryScenario, action: ScenarioAction): InventoryScenario | MovementRecord[] {
  switch (action) {
    case 'archive': return { ...scenario, item: archiveItem(scenario.item) }
    case 'restore': return { ...scenario, item: restoreItem(scenario.item) }
    case 'history': return scenario.history.map((record) => ({ ...record }))
  }
}
