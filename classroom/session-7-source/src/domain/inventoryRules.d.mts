export interface StockMovementInput { type: string; currentStock: number; amount: number }
export interface StockMovementResult { valid: boolean; message: string; nextStock: number | null }
export interface ProductInput {
  name?: unknown; category?: unknown; description?: unknown; price?: unknown
  colors?: unknown; sizes?: unknown; stocks?: unknown
}
export interface StocktakingRuleRecord {
  id?: string; itemId?: string; type?: string; amount?: number; prevAmount?: number; nextAmount?: number
}
export interface InventoryRuleItem {
  id: string; amount: number; stocktakingHistory: string[]
}
export function evaluateStockMovement(input: StockMovementInput): StockMovementResult
export function validateProduct(product: ProductInput): { valid: boolean; errors: string[] }
export function validateStocktakingRecord(record: StocktakingRuleRecord | null | undefined): { valid: boolean; errors: string[] }
export function validateInventoryConsistency(items: InventoryRuleItem[], records: StocktakingRuleRecord[]): {
  valid: boolean; errors: string[]; recordResults: Record<string, boolean>
}
