import Dexie, { type EntityTable } from 'dexie'
import type { Item, StockMovement, User } from '../types/models'

class TechlithDatabase extends Dexie {
  users!: EntityTable<User, 'id'>
  items!: EntityTable<Item, 'id'>
  stockMovements!: EntityTable<StockMovement, 'id'>

  constructor() {
    super('TechlithSoftwareTestingDB')
    this.version(1).stores({
      users: 'id, username, role',
      items: 'id, name, category, isActive',
      stockMovements: 'id, itemId, type, actorUserId, source, createdAt',
    })
    this.version(2)
      .stores({
        users: 'id, username, role',
        items: 'id, name, category, isActive',
        stockMovements: 'id, itemId, type, actorUserId, source, createdAt',
      })
      .upgrade(async (transaction) => {
        const movements = await transaction.table('stockMovements').toArray()
        for (const movement of movements) {
          const item = await transaction.table('items').get(movement.itemId)
          if (!item) continue
          await transaction.table('stockMovements').update(movement.id, {
            itemNameSnapshot: item.name,
            itemUnitSnapshot: item.unit,
            itemCategorySnapshot: item.category,
          })
        }
      })
    this.version(3)
      .stores({
        users: 'id, username, role',
        items: 'id, &code, name, category, isActive',
        stockMovements: 'id, &code, itemId, itemCodeSnapshot, type, actorUserId, source, createdAt',
      })
      .upgrade(async (transaction) => {
        const itemsTable = transaction.table('items')
        const legacyItems = (await itemsTable.toArray()) as Item[]
        const seedCodes = new Map(Array.from({ length: 10 }, (_, index) => {
          const sequence = String(index + 1).padStart(3, '0')
          return [`ITM-${sequence}`, `BRG-${sequence}`]
        }))
        const usedItemCodes = new Set(seedCodes.values())
        const itemCodeById = new Map<string, string>()
        const orderedItems = legacyItems.sort((left, right) => {
          const leftSeed = seedCodes.has(left.id) ? 0 : 1
          const rightSeed = seedCodes.has(right.id) ? 0 : 1
          return leftSeed - rightSeed || left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id)
        })
        let nextItemSequence = 11

        for (const item of orderedItems) {
          const seedCode = seedCodes.get(item.id)
          let code = seedCode
          if (!code) {
            const existingCode = /^BRG-(\d+)$/.test(item.code ?? '') && !usedItemCodes.has(item.code) ? item.code : undefined
            const legacyMatch = /^ITM-(\d+)$/.exec(item.id)
            const derivedCode = legacyMatch ? `BRG-${legacyMatch[1].padStart(3, '0')}` : undefined
            code = existingCode ?? (derivedCode && !usedItemCodes.has(derivedCode) ? derivedCode : undefined)
            while (!code || usedItemCodes.has(code)) {
              const candidate = `BRG-${String(nextItemSequence++).padStart(3, '0')}`
              if (!usedItemCodes.has(candidate)) code = candidate
            }
          }
          usedItemCodes.add(code)
          itemCodeById.set(item.id, code)
          await itemsTable.update(item.id, { code })
        }

        const movementTable = transaction.table('stockMovements')
        const movements = (await movementTable.toArray()) as StockMovement[]
        movements.sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id))
        const movementCodes = new Set<string>()
        const codeByMovementId = new Map<string, string>()
        const unassignedMovements: StockMovement[] = []

        for (const movement of movements) {
          if (/^TRX-STK-\d+$/.test(movement.code ?? '') && !movementCodes.has(movement.code)) {
            movementCodes.add(movement.code)
            codeByMovementId.set(movement.id, movement.code)
          } else {
            unassignedMovements.push(movement)
          }
        }

        let nextMovementSequence = 1
        for (const movement of unassignedMovements) {
          let code = ''
          while (!code || movementCodes.has(code)) {
            const candidate = `TRX-STK-${String(nextMovementSequence++).padStart(4, '0')}`
            if (!movementCodes.has(candidate)) code = candidate
          }
          movementCodes.add(code)
          codeByMovementId.set(movement.id, code)
        }

        for (const movement of movements) {
          const item = legacyItems.find((candidate) => candidate.id === movement.itemId)
          const itemCodeSnapshot = movement.itemCodeSnapshot || itemCodeById.get(movement.itemId)
          await movementTable.update(movement.id, {
            code: codeByMovementId.get(movement.id),
            itemCodeSnapshot,
            itemNameSnapshot: movement.itemNameSnapshot || item?.name,
            itemUnitSnapshot: movement.itemUnitSnapshot || item?.unit,
            itemCategorySnapshot: movement.itemCategorySnapshot || item?.category,
          })
        }
      })
  }
}

export const db = new TechlithDatabase()
