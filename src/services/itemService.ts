import { db } from '../db/database'
import type { Item } from '../types/models'

export interface ItemInput {
  name: string
  category: string
  description: string
  unit: string
}

export type ItemStatusFilter = 'ACTIVE' | 'ARCHIVED' | 'ALL'

function cleanRequired(value: string, label: string): string {
  const cleaned = value.trim()
  if (!cleaned) throw new Error(`${label} is required.`)
  return cleaned
}

function cleanInput(input: ItemInput): ItemInput {
  return {
    name: cleanRequired(input.name, 'Item name'),
    category: cleanRequired(input.category, 'Category'),
    description: input.description.trim(),
    unit: cleanRequired(input.unit, 'Unit'),
  }
}

export async function listItems(options: {
  search?: string
  category?: string
  status?: ItemStatusFilter
} = {}): Promise<Item[]> {
  const status = options.status ?? 'ACTIVE'
  const search = options.search?.trim().toLocaleLowerCase() ?? ''
  const category = options.category ?? ''
  const items = await db.items.orderBy('code').toArray()
  return items.filter((item) => {
    if (status === 'ACTIVE' && !item.isActive) return false
    if (status === 'ARCHIVED' && item.isActive) return false
    if (category && item.category !== category) return false
    if (search && !`${item.code} ${item.name}`.toLocaleLowerCase().includes(search)) return false
    return true
  })
}

export async function getItemByCode(itemCode: string): Promise<Item | undefined> {
  return db.items.where('code').equals(itemCode).first()
}

async function nextItemCode(): Promise<string> {
  const items = await db.items.toArray()
  const highest = items.reduce((max, item) => {
    const match = /^BRG-(\d+)$/.exec(item.code)
    return match ? Math.max(max, Number(match[1])) : max
  }, 0)
  return `BRG-${String(highest + 1).padStart(3, '0')}`
}

export async function createItem(input: ItemInput): Promise<Item> {
  const clean = cleanInput(input)
  return db.transaction('rw', db.items, async () => {
    const id = crypto.randomUUID()
    const code = await nextItemCode()
    const now = new Date().toISOString()
    const item: Item = {
      id,
      code,
      ...clean,
      stock: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }
    await db.items.add(item)
    return item
  })
}

export async function updateItem(itemId: string, input: ItemInput): Promise<Item> {
  const clean = cleanInput(input)
  return db.transaction('rw', db.items, async () => {
    const item = await db.items.get(itemId)
    if (!item) throw new Error('Item was not found.')
    const updated: Item = { ...item, ...clean, updatedAt: new Date().toISOString() }
    await db.items.put(updated)
    return updated
  })
}

export async function setItemArchived(itemId: string, archived: boolean): Promise<void> {
  await db.transaction('rw', db.items, async () => {
    const item = await db.items.get(itemId)
    if (!item) throw new Error('Item was not found.')
    await db.items.update(itemId, { isActive: !archived, updatedAt: new Date().toISOString() })
  })
}
