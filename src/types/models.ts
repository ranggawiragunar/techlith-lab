export type UserRole = 'ADMIN'

export interface User {
  id: string
  username: string
  password: string
  role: UserRole
  displayName: string
  createdAt: string
}

export interface Item {
  id: string
  code: string
  name: string
  category: string
  description: string
  stock: number
  unit: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type MovementType = 'INBOUND' | 'OUTBOUND'
export type MovementSource = 'MANUAL_STOCK_INBOUND' | 'MANUAL_STOCK_OUTBOUND'

export interface StockMovement {
  id: string
  code: string
  itemId: string
  itemCodeSnapshot?: string
  itemNameSnapshot: string
  itemUnitSnapshot: string
  itemCategorySnapshot?: string
  type: MovementType
  prevAmount: number
  amount: number
  nextAmount: number
  actorUserId: string
  source: MovementSource
  notes: string
  createdAt: string
}
