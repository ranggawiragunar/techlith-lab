import { db } from '../db/database'
import { initializeDatabase } from '../db/seed'

export async function resetTestingData(): Promise<void> {
  await db.transaction('rw', db.users, db.items, db.stockMovements, async () => {
    await db.users.clear()
    await db.items.clear()
    await db.stockMovements.clear()
  })
  await initializeDatabase()
}
