import {
  arrayUnion,
  collection,
  doc,
  runTransaction,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase/client'
import { evaluateStockMovement, validateStocktakingRecord } from '../domain/inventoryRules.mjs'
import { InjectedFailureError, OperationError, type TransactionInput, type TransactionResult, type TransactionType } from '../types'

export async function executeStocktaking(input: TransactionInput): Promise<TransactionResult> {
  const { itemId, type, amount, failureMode } = input

  if (type !== 'inbound' && type !== 'outbound') {
    throw new OperationError('Pilih tipe transaksi inbound atau outbound.')
  }
  if (!['none', 'stocktaking-write', 'item-update'].includes(failureMode)) {
    throw new OperationError('Mode failure injection tidak dikenal.')
  }

  const itemRef = doc(db, 'items', itemId)
  const stocktakingRef = doc(collection(db, 'stocktakings'))
  const dateCreated = Timestamp.now()

  return runTransaction(db, async (transaction) => {
    const itemSnapshot = await transaction.get(itemRef)
    if (!itemSnapshot.exists()) {
      throw new OperationError(`Item ${itemId} tidak ditemukan di Firestore Emulator.`)
    }

    const item = itemSnapshot.data()
    const previousAmount = item.amount
    if (typeof previousAmount !== 'number' || !Number.isSafeInteger(previousAmount) || previousAmount < 0) {
      throw new OperationError(`Current stock pada ${itemId} bukan bilangan bulat non-negatif yang valid.`)
    }
    if (!Array.isArray(item.stocktakingHistory)) {
      throw new OperationError(`stocktakingHistory pada ${itemId} tidak valid.`)
    }

    const movement = evaluateStockMovement({ type, currentStock: previousAmount, amount })
    if (!movement.valid || movement.nextStock === null) throw new OperationError(movement.message)
    const nextAmount = movement.nextStock

    const record = {
      itemId,
      type: type as TransactionType,
      amount,
      prevAmount: previousAmount,
      nextAmount,
      dateCreated,
    }
    const recordValidation = validateStocktakingRecord(record)
    if (!recordValidation.valid) throw new OperationError(recordValidation.errors.join(' '))

    // Inject at the transaction's stocktaking write boundary. Throwing aborts
    // the transaction before Firestore commits any buffered writes.
    if (failureMode === 'stocktaking-write') {
      throw new InjectedFailureError('stocktaking-write')
    }
    transaction.set(stocktakingRef, record)

    // The stocktaking set is buffered, not committed. This injected error
    // proves an item-update failure cannot leave an orphan transaction.
    if (failureMode === 'item-update') {
      throw new InjectedFailureError('item-update')
    }
    transaction.update(itemRef, {
      amount: nextAmount,
      stocktakingHistory: arrayUnion(stocktakingRef.id),
    })

    return {
      transactionId: stocktakingRef.id,
      itemId,
      type: type as TransactionType,
      amount,
      prevAmount: previousAmount,
      nextAmount,
    }
  })
}
