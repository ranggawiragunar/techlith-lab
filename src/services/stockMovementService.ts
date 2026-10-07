import { db } from '../db/database'
import type { StockMovement } from '../types/models'
import { allowsFractionalQuantity, normalizeQuantity } from '../utils/quantity'

export class StockMovementError extends Error {}

async function nextTransactionCode(): Promise<string> {
  const movements = await db.stockMovements.toArray()
  const highest = movements.reduce((max, movement) => {
    const match = /^TRX-STK-(\d+)$/.exec(movement.code ?? '')
    return match ? Math.max(max, Number(match[1])) : max
  }, 0)
  return `TRX-STK-${String(highest + 1).padStart(4, '0')}`
}

export async function createInboundMovement(input: {
  itemId: string
  amount: number
  actorUserId: string
  notes?: string
}): Promise<StockMovement> {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new StockMovementError('Amount must be greater than zero.')
  }
  if (normalizeQuantity(input.amount) !== input.amount) {
    throw new StockMovementError('Use no more than three decimal places.')
  }

  return db.transaction('rw', db.items, db.stockMovements, async () => {
    const item = await db.items.get(input.itemId)
    if (!item) throw new StockMovementError('Item was not found.')
    if (!item.isActive) throw new StockMovementError('Archived items cannot receive stock.')
    if (!allowsFractionalQuantity(item.unit) && !Number.isInteger(input.amount)) {
      throw new StockMovementError(`Enter a whole number for ${item.unit}.`)
    }

    const prevAmount = item.stock
    const amount = normalizeQuantity(input.amount)
    const nextAmount = normalizeQuantity(prevAmount + amount)
    const createdAt = new Date().toISOString()
    const code = await nextTransactionCode()
    const movement: StockMovement = {
      id: crypto.randomUUID(),
      code,
      itemId: item.id,
      itemCodeSnapshot: item.code,
      itemNameSnapshot: item.name,
      itemUnitSnapshot: item.unit,
      itemCategorySnapshot: item.category,
      type: 'INBOUND',
      prevAmount,
      amount,
      nextAmount,
      actorUserId: input.actorUserId,
      source: 'MANUAL_STOCK_INBOUND',
      notes: input.notes?.trim() ?? '',
      createdAt,
    }

    await db.items.update(item.id, { stock: nextAmount, updatedAt: createdAt })
    await db.stockMovements.add(movement)
    return movement
  })
}

export async function createOutboundMovement(input: {
  itemId: string
  amount: number
  actorUserId: string
  notes?: string
}): Promise<StockMovement> {
  return db.transaction('rw', db.items, db.stockMovements, async () => {
    const item = await db.items.get(input.itemId)
    if (!item) throw new StockMovementError('Item was not found.')
    if (!item.isActive) throw new StockMovementError('Archived items cannot receive stock movements.')
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new StockMovementError('Jumlah outbound harus lebih besar dari 0.')
    }
    if (normalizeQuantity(input.amount) !== input.amount) {
      throw new StockMovementError('Use no more than three decimal places.')
    }
    if (!allowsFractionalQuantity(item.unit) && !Number.isInteger(input.amount)) {
      throw new StockMovementError(`Enter a whole number for ${item.unit}.`)
    }

    const prevAmount = item.stock
    const amount = normalizeQuantity(input.amount)
    const nextAmount = normalizeQuantity(prevAmount - amount)
    const createdAt = new Date().toISOString()
    const code = await nextTransactionCode()
    const movement: StockMovement = {
      id: crypto.randomUUID(),
      code,
      itemId: item.id,
      itemCodeSnapshot: item.code,
      itemNameSnapshot: item.name,
      itemUnitSnapshot: item.unit,
      itemCategorySnapshot: item.category,
      type: 'OUTBOUND',
      prevAmount,
      amount,
      nextAmount,
      actorUserId: input.actorUserId,
      source: 'MANUAL_STOCK_OUTBOUND',
      notes: input.notes?.trim() ?? '',
      createdAt,
    }

    await db.items.update(item.id, { stock: nextAmount, updatedAt: createdAt })
    await db.stockMovements.add(movement)
    return movement
  })
}

export async function listStockMovements(): Promise<StockMovement[]> {
  return db.stockMovements.orderBy('createdAt').reverse().toArray()
}

export async function listMovementsForItem(itemId: string, limit = 5): Promise<StockMovement[]> {
  const rows = await db.stockMovements.where('itemId').equals(itemId).toArray()
  return rows.sort((left, right) => right.createdAt.localeCompare(left.createdAt)).slice(0, limit)
}
