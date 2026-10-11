import test from 'node:test'
import assert from 'node:assert/strict'
import {
  evaluateStockMovement,
  validateInventoryConsistency,
  validateProduct,
  validateStocktakingRecord,
} from '../src/domain/inventoryRules.mjs'

const baselineProduct = {
  name: 'Kain Katun', category: 'Kain', description: 'Kain katun untuk kebutuhan jahit.',
  price: 25000, colors: ['Putih'], sizes: ['2 meter'], stocks: [{ amount: 10, amountType: 'meter' }],
}

for (const [id, type, amount, valid, nextStock] of [
  ['REG-F-01 outbound 0', 'outbound', 0, false, 10],
  ['REG boundary outbound -1', 'outbound', -1, false, 10],
  ['REG boundary outbound 1', 'outbound', 1, true, 9],
  ['REG-F-02 outbound 10', 'outbound', 10, true, 0],
  ['REG-F-03 outbound 11', 'outbound', 11, false, 10],
  ['REG-F-04 inbound 5', 'inbound', 5, true, 15],
]) {
  test(`stock boundary: ${id}`, () => {
    const result = evaluateStockMovement({ type, currentStock: 10, amount })
    assert.equal(result.valid, valid)
    assert.equal(result.nextStock, nextStock)
  })
}

for (const [label, amount] of [
  ['decimal', 1.5], ['NaN', Number.NaN], ['infinity', Number.POSITIVE_INFINITY], ['undefined', undefined],
]) {
  test(`stock boundary rejects ${label}`, () => {
    const result = evaluateStockMovement({ type: 'inbound', currentStock: 10, amount })
    assert.equal(result.valid, false)
    assert.equal(result.nextStock, 10)
  })
}

test('stock boundary rejects invalid type and malformed current stock', () => {
  assert.equal(evaluateStockMovement({ type: 'adjustment', currentStock: 10, amount: 1 }).valid, false)
  for (const currentStock of [-1, 1.2, Number.NaN, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(evaluateStockMovement({ type: 'inbound', currentStock, amount: 1 }).valid, false)
  }
})

test('product validation accepts a complete valid product', () => {
  assert.deepEqual(validateProduct(baselineProduct), { valid: true, errors: [] })
})

test('product validation rejects incomplete product fields', () => {
  const result = validateProduct({})
  assert.equal(result.valid, false)
  assert.equal(result.errors.length, 7)
})

test('product validation preserves the historical incomplete-with-stock-config defect pattern as rejected', () => {
  const result = validateProduct({ stocks: [{ amount: 1, amountType: 'pcs' }] })
  assert.equal(result.valid, false)
  assert.equal(result.errors.length, 6)
})

test('product validation rejects blank text, empty options, and non-finite price', () => {
  const result = validateProduct({ ...baselineProduct, name: '  ', colors: [' '], sizes: [], price: Number.NaN })
  assert.equal(result.valid, false)
  assert.ok(result.errors.length >= 4)
})

for (const [label, record, valid] of [
  ['valid inbound arithmetic', { itemId: 'ITM-001', type: 'inbound', amount: 5, prevAmount: 10, nextAmount: 15 }, true],
  ['valid outbound arithmetic', { itemId: 'ITM-001', type: 'outbound', amount: 10, prevAmount: 10, nextAmount: 0 }, true],
  ['invalid inbound arithmetic', { itemId: 'ITM-001', type: 'inbound', amount: 5, prevAmount: 10, nextAmount: 14 }, false],
  ['invalid outbound arithmetic', { itemId: 'ITM-001', type: 'outbound', amount: 11, prevAmount: 10, nextAmount: 0 }, false],
  ['negative previous stock', { itemId: 'ITM-001', type: 'inbound', amount: 1, prevAmount: -1, nextAmount: 0 }, false],
  ['zero amount', { itemId: 'ITM-001', type: 'inbound', amount: 0, prevAmount: 10, nextAmount: 10 }, false],
  ['negative next stock', { itemId: 'ITM-001', type: 'outbound', amount: 1, prevAmount: 0, nextAmount: -1 }, false],
  ['unknown operation', { itemId: 'ITM-001', type: 'transfer', amount: 1, prevAmount: 0, nextAmount: 1 }, false],
]) {
  test(`record consistency: ${label}`, () => assert.equal(validateStocktakingRecord(record).valid, valid))
}

test('inventory consistency accepts empty seeded baseline', () => {
  const items = [{ id: 'ITM-001', amount: 10, stocktakingHistory: [] }]
  assert.deepEqual(validateInventoryConsistency(items, []), { valid: true, errors: [], recordResults: {} })
})

test('inventory consistency accepts linked two-record stock chain', () => {
  const items = [{ id: 'ITM-001', amount: 12, stocktakingHistory: ['TX-1', 'TX-2'] }]
  const records = [
    { id: 'TX-1', itemId: 'ITM-001', type: 'inbound', amount: 5, prevAmount: 10, nextAmount: 15 },
    { id: 'TX-2', itemId: 'ITM-001', type: 'outbound', amount: 3, prevAmount: 15, nextAmount: 12 },
  ]
  const result = validateInventoryConsistency(items, records)
  assert.equal(result.valid, true)
  assert.deepEqual(result.recordResults, { 'TX-1': true, 'TX-2': true })
})

test('inventory consistency detects dangling, orphaned, and mismatched references', () => {
  const items = [{ id: 'ITM-001', amount: 99, stocktakingHistory: ['TX-1', 'MISSING'] }]
  const records = [
    { id: 'TX-1', itemId: 'ITM-002', type: 'inbound', amount: 2, prevAmount: 10, nextAmount: 12 },
    { id: 'ORPHAN', itemId: 'ITM-001', type: 'inbound', amount: 1, prevAmount: 20, nextAmount: 21 },
  ]
  const result = validateInventoryConsistency(items, records)
  assert.equal(result.valid, false)
  assert.equal(result.recordResults['TX-1'], false)
  assert.ok(result.errors.length >= 4)
})

test('inventory consistency detects a broken amount chain and current stock mismatch', () => {
  const items = [{ id: 'ITM-001', amount: 50, stocktakingHistory: ['TX-1', 'TX-2'] }]
  const records = [
    { id: 'TX-1', itemId: 'ITM-001', type: 'inbound', amount: 5, prevAmount: 10, nextAmount: 15 },
    { id: 'TX-2', itemId: 'ITM-001', type: 'outbound', amount: 3, prevAmount: 16, nextAmount: 13 },
  ]
  const result = validateInventoryConsistency(items, records)
  assert.equal(result.valid, false)
  assert.equal(result.recordResults['TX-2'], false)
  assert.ok(result.errors.some((message) => message.includes('rantai stok putus')))
  assert.ok(result.errors.some((message) => message.includes('stok saat ini berbeda')))
})
