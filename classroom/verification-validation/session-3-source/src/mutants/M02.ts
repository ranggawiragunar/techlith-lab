// M02 — controlled mutant: exact-stock quantity is treated as over-stock.
export function m02IsOverStock(amount: number, stock: number): boolean {
  return amount >= stock
}
