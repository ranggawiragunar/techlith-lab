import type { Timestamp } from 'firebase/firestore'

export type TransactionType = 'inbound' | 'outbound'
export type FailureMode = 'none' | 'stocktaking-write' | 'item-update'

export interface ItemRecord {
  id: string
  name: string
  amount: number
  amountType: string
  stocktakingHistory: string[]
}

export interface StocktakingRecord {
  id: string
  itemId: string
  type: TransactionType
  amount: number
  prevAmount: number
  nextAmount: number
  dateCreated: Timestamp
}

export interface TransactionInput {
  itemId: string
  type: string
  amount: number
  failureMode: FailureMode
}

export interface TransactionResult {
  transactionId: string
  itemId: string
  type: TransactionType
  amount: number
  prevAmount: number
  nextAmount: number
}

export class OperationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OperationError'
  }
}

export class InjectedFailureError extends Error {
  readonly boundary: Exclude<FailureMode, 'none'>

  constructor(boundary: Exclude<FailureMode, 'none'>) {
    super(`Kegagalan terkontrol pada tahap ${boundary}. Transaksi dibatalkan tanpa menyimpan perubahan.`)
    this.name = 'InjectedFailureError'
    this.boundary = boundary
  }
}
