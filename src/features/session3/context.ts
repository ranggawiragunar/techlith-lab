import { createContext, useContext } from 'react'
import type { ClassroomItem } from './classroomModel'
import type { ClassroomProduct } from './productModel'

interface ClassroomLabContextValue {
  items: readonly ClassroomItem[]
  products: readonly ClassroomProduct[]
  setItemStock: (code: string, stock: number) => void
  submitOutbound: (code: string, amount: number) => ClassroomOutboundResult
  addProduct: (product: ClassroomProduct) => void
  resetLabData: () => void
}

export type ClassroomOutboundResult =
  | { accepted: true; nextStock: number }
  | { accepted: false; reason: 'invalid-quantity' | 'non-positive' | 'exceeds-stock' | 'item-not-found' }

export const ClassroomLabContext = createContext<ClassroomLabContextValue | null>(null)

export function useClassroomLab(): ClassroomLabContextValue {
  const context = useContext(ClassroomLabContext)
  if (!context) throw new Error('useClassroomLab must be used inside ClassroomLabProvider.')
  return context
}
