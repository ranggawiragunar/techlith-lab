import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { createClassroomBaseline } from './classroomFixture'
import { ClassroomLabContext, type ClassroomOutboundResult } from './context'
import type { ClassroomItem } from './classroomModel'
import type { ClassroomProduct } from './productModel'

export function ClassroomLabProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ClassroomItem[]>(createClassroomBaseline)
  const [products, setProducts] = useState<ClassroomProduct[]>([])

  const setItemStock = useCallback((code: string, stock: number) => {
    setItems((currentItems) => currentItems.map((item) => (
      item.code === code ? { ...item, stock } : item
    )))
  }, [])

  const submitOutbound = useCallback((code: string, amount: number): ClassroomOutboundResult => {
    const item = items.find((candidate) => candidate.code === code)
    if (!item) return { accepted: false, reason: 'item-not-found' }
    if (!Number.isFinite(amount)) return { accepted: false, reason: 'invalid-quantity' }
    if (amount <= 0) return { accepted: false, reason: 'non-positive' }
    if (amount > item.stock) return { accepted: false, reason: 'exceeds-stock' }

    const nextStock = item.stock - amount
    setItems((currentItems) => currentItems.map((currentItem) => (
      currentItem.code === code ? { ...currentItem, stock: nextStock } : currentItem
    )))
    return { accepted: true, nextStock }
  }, [items])

  const resetLabData = useCallback(() => {
    setItems(createClassroomBaseline())
    setProducts([])
  }, [])

  const addProduct = useCallback((product: ClassroomProduct) => {
    setProducts((currentProducts) => [...currentProducts, {
      ...product,
      colors: [...product.colors],
      sizes: [...product.sizes],
      stocks: product.stocks.map((stock) => ({ ...stock })),
    }])
  }, [])

  const value = useMemo(() => ({ items, products, setItemStock, submitOutbound, addProduct, resetLabData }), [items, products, setItemStock, submitOutbound, addProduct, resetLabData])

  return <ClassroomLabContext.Provider value={value}>{children}</ClassroomLabContext.Provider>
}
