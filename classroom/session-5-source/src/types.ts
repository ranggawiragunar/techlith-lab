import type { Timestamp } from 'firebase/firestore'

export type TransactionType = 'inbound' | 'outbound'
export type FlowName = 'baseline' | 'safe'
export type FailureMode = 'normal' | 'stocktaking-write' | 'item-update'

export interface ItemRecord {
  name: string
  amount: number
  unit: string
  stocktakingHistory: string[]
}

export interface StocktakingRecord {
  itemId: string
  amount: number
  prevAmount: number
  nextAmount: number
  type: TransactionType
  dateCreated: Timestamp
}

export interface RuntimeMessage {
  id: string
  kind: 'warning' | 'success'
  text: string
  createdAt: string
}
