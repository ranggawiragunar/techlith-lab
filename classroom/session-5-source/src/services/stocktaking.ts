import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/client'
import type { FailureMode, RuntimeMessage, TransactionType } from '../types'

type MessageWriter = (kind: RuntimeMessage['kind'], text: string) => void

function injectedFailure(boundary: 'stocktaking-write' | 'item-update'): Promise<never> {
  return Promise.reject(new Error(`Kegagalan injeksi pada batas write: ${boundary}.`))
}

export async function executeStocktaking(
  itemId: string,
  type: TransactionType,
  amount: number,
  flow: 'baseline' | 'safe',
  failureMode: FailureMode,
  addMessage: MessageWriter,
): Promise<void> {
  const itemRef = doc(db, 'items', itemId)
  const itemSnapshot = await getDoc(itemRef)
  if (!itemSnapshot.exists()) throw new Error(`Item ${itemId} tidak ditemukan di Firestore Emulator.`)

  const previousAmount = itemSnapshot.data().amount
  if (typeof previousAmount !== 'number') throw new Error(`Field amount pada ${itemId} bukan angka.`)
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Amount harus berupa angka lebih besar dari 0.')
  if (type === 'outbound' && amount > previousAmount) {
    throw new Error(`Outbound ditolak: amount ${amount} melebihi stock tersedia ${previousAmount}.`)
  }

  const nextAmount = type === 'inbound' ? previousAmount + amount : previousAmount - amount
  const stocktakingRef = doc(collection(db, 'stocktakings'))
  const stocktakingData = {
    itemId,
    amount,
    prevAmount: previousAmount,
    nextAmount,
    type,
    dateCreated: Timestamp.now(),
  }

  const writeStocktaking = () => failureMode === 'stocktaking-write'
    ? injectedFailure('stocktaking-write')
    : setDoc(stocktakingRef, stocktakingData)

  const writeItem = () => failureMode === 'item-update'
    ? injectedFailure('item-update')
    : updateDoc(itemRef, {
      amount: nextAmount,
      stocktakingHistory: arrayUnion(stocktakingRef.id),
    })

  if (flow === 'baseline') {
    // Preserve the source-like promise chain: a failed first write is caught,
    // then the item update continues; a failed item update rolls back, then
    // the final .then still emits success.
    await writeStocktaking()
      .catch((error: unknown) => {
        addMessage('warning', `Stocktaking write warning: ${messageOf(error)}`)
      })
      .then(() => writeItem()
        .catch(async (error: unknown) => {
          await deleteDoc(stocktakingRef)
          addMessage('warning', `Item update warning; rollback requested: ${messageOf(error)}`)
        })
        .then(() => {
          addMessage('success', `Transaksi ${type} berhasil.`)
        }))
    return
  }

  try {
    await writeStocktaking()
  } catch (error) {
    addMessage('warning', `Reference Safe Flow berhenti setelah stocktaking write gagal: ${messageOf(error)}`)
    return
  }

  try {
    await writeItem()
  } catch (error) {
    try {
      await deleteDoc(stocktakingRef)
      addMessage('warning', `Item update gagal; rollback stocktaking dijalankan: ${messageOf(error)}`)
    } catch (rollbackError) {
      addMessage('warning', `Item update gagal dan rollback juga gagal: ${messageOf(rollbackError)}`)
    }
    return
  }

  addMessage('success', `Transaksi ${type} berhasil.`)
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
