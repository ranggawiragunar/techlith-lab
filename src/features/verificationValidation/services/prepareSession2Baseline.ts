import { db } from '../../../db/database'
import { resetTestingData } from '../../../services/resetTestingData'

export const session2BoundaryItem = {
  code: 'BRG-005',
  unit: 'pcs',
  stock: 10,
} as const

export async function prepareSession2Baseline(): Promise<void> {
  await resetTestingData()

  await db.transaction('rw', db.items, db.stockMovements, async () => {
    const item = await db.items.where('code').equals(session2BoundaryItem.code).first()
    if (!item || !item.isActive || item.unit !== session2BoundaryItem.unit) {
      throw new Error('The designated Session 2 boundary item is unavailable in the seed baseline.')
    }

    await db.items.update(item.id, { stock: session2BoundaryItem.stock, updatedAt: new Date().toISOString() })
    await db.stockMovements.clear()
  })
}
