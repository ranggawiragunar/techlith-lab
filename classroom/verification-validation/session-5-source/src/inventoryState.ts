import type { InventoryItem, InventoryState } from './types'

export function archiveItem(item: InventoryItem): InventoryItem {
  return { ...item, state: 'ARCHIVED' }
}

export function restoreItem(item: InventoryItem): InventoryItem {
  return { ...item, state: 'ACTIVE' }
}

export function canAcceptMovement(state: InventoryState): boolean {
  return state === 'ACTIVE'
}
