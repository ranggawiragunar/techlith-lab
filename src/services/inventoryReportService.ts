import { db } from '../db/database'
import type { Item } from '../types/models'
import { normalizeQuantity } from '../utils/quantity'

export interface InventoryReportRow {
  item: Item
  totalInbound: number
  totalOutbound: number
  movementCount: number
}

export interface InventoryReportData {
  rows: InventoryReportRow[]
  movementCount: number
}

interface MovementTotals {
  totalInbound: number
  totalOutbound: number
  movementCount: number
}

export async function getInventoryReport(): Promise<InventoryReportData> {
  const [items, movements] = await Promise.all([
    db.items.orderBy('code').toArray(),
    db.stockMovements.toArray(),
  ])

  const totalsByItemId = new Map<string, MovementTotals>()

  for (const movement of movements) {
    const totals = totalsByItemId.get(movement.itemId) ?? {
      totalInbound: 0,
      totalOutbound: 0,
      movementCount: 0,
    }

    if (movement.type === 'INBOUND') {
      totals.totalInbound = normalizeQuantity(totals.totalInbound + movement.amount)
    } else if (movement.type === 'OUTBOUND') {
      totals.totalOutbound = normalizeQuantity(totals.totalOutbound + movement.amount)
    }
    totals.movementCount += 1
    totalsByItemId.set(movement.itemId, totals)
  }

  return {
    rows: items.map((item) => ({
      item,
      totalInbound: totalsByItemId.get(item.id)?.totalInbound ?? 0,
      totalOutbound: totalsByItemId.get(item.id)?.totalOutbound ?? 0,
      movementCount: totalsByItemId.get(item.id)?.movementCount ?? 0,
    })),
    movementCount: movements.length,
  }
}
