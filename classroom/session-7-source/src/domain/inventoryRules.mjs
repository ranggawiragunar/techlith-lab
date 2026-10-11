const validTypes = new Set(['inbound', 'outbound'])

export function evaluateStockMovement({ type, currentStock, amount }) {
  if (!validTypes.has(type)) return { valid: false, message: 'Pilih tipe transaksi inbound atau outbound.', nextStock: currentStock }
  if (!Number.isSafeInteger(currentStock) || currentStock < 0) {
    return { valid: false, message: 'Stok saat ini harus berupa bilangan bulat non-negatif yang valid.', nextStock: null }
  }
  if (!Number.isSafeInteger(amount)) {
    return { valid: false, message: 'Jumlah harus berupa bilangan bulat yang valid.', nextStock: currentStock }
  }
  if (amount <= 0) return { valid: false, message: 'Jumlah harus lebih besar dari 0.', nextStock: currentStock }
  if (type === 'outbound' && amount > currentStock) {
    return { valid: false, message: `Outbound ditolak: jumlah ${amount} melebihi stok tersedia ${currentStock}.`, nextStock: currentStock }
  }
  const nextStock = type === 'inbound' ? currentStock + amount : currentStock - amount
  if (!Number.isSafeInteger(nextStock) || nextStock < 0) {
    return { valid: false, message: 'Transaksi akan menghasilkan jumlah stok yang tidak valid.', nextStock: currentStock }
  }
  return { valid: true, message: 'Pergerakan stok valid.', nextStock }
}

export function validateProduct(product) {
  const errors = []
  if (typeof product?.name !== 'string' || !product.name.trim()) errors.push('Nama barang wajib diisi.')
  if (typeof product?.category !== 'string' || !product.category.trim()) errors.push('Kategori wajib diisi.')
  if (typeof product?.description !== 'string' || !product.description.trim()) errors.push('Deskripsi wajib diisi.')
  if (typeof product?.price !== 'number' || !Number.isFinite(product.price) || product.price <= 0) errors.push('Harga harus berupa angka positif yang valid.')
  if (!Array.isArray(product?.colors) || !product.colors.length || product.colors.some((value) => typeof value !== 'string' || !value.trim())) errors.push('Warna minimal berisi satu nilai yang valid.')
  if (!Array.isArray(product?.sizes) || !product.sizes.length || product.sizes.some((value) => typeof value !== 'string' || !value.trim())) errors.push('Ukuran minimal berisi satu nilai yang valid.')
  if (!Array.isArray(product?.stocks) || !product.stocks.length) errors.push('Konfigurasi stok minimal berisi satu nilai.')
  return { valid: errors.length === 0, errors }
}

export function validateStocktakingRecord(record) {
  const errors = []
  if (!record || typeof record.itemId !== 'string' || !record.itemId.trim()) errors.push('Kode barang pada transaksi wajib diisi.')
  if (!validTypes.has(record?.type)) errors.push('Tipe transaksi tidak valid.')
  if (!Number.isSafeInteger(record?.amount) || record.amount <= 0) errors.push('Jumlah transaksi harus bilangan bulat positif.')
  if (!Number.isSafeInteger(record?.prevAmount) || record.prevAmount < 0) errors.push('Stok sebelum harus bilangan bulat non-negatif.')
  if (!Number.isSafeInteger(record?.nextAmount) || record.nextAmount < 0) errors.push('Stok sesudah harus bilangan bulat non-negatif.')
  if (errors.length === 0) {
    const expected = record.type === 'inbound' ? record.prevAmount + record.amount : record.prevAmount - record.amount
    if (!Number.isSafeInteger(expected) || expected !== record.nextAmount) errors.push('Jumlah sebelum, jumlah transaksi, dan jumlah sesudah tidak konsisten.')
  }
  return { valid: errors.length === 0, errors }
}

export function validateInventoryConsistency(items, records) {
  const errors = []
  const recordResults = {}
  const itemById = new Map(items.map((item) => [item.id, item]))
  const recordById = new Map()
  for (const record of records) {
    if (recordById.has(record.id)) errors.push(`Kode transaksi duplikat: ${record.id}.`)
    recordById.set(record.id, record)
    const result = validateStocktakingRecord(record)
    recordResults[record.id] = result.valid
    if (!result.valid) errors.push(...result.errors.map((message) => `${record.id}: ${message}`))
    const item = itemById.get(record.itemId)
    if (!item) {
      recordResults[record.id] = false
      errors.push(`${record.id}: barang ${record.itemId} tidak ditemukan.`)
    } else if (!Array.isArray(item.stocktakingHistory) || !item.stocktakingHistory.includes(record.id)) {
      recordResults[record.id] = false
      errors.push(`${record.id}: referensi tidak tercantum pada history barang.`)
    }
  }
  for (const item of items) {
    if (!Array.isArray(item.stocktakingHistory)) {
      errors.push(`${item.id}: stocktakingHistory bukan daftar referensi.`)
      continue
    }
    const historyRecords = []
    const seen = new Set()
    for (const reference of item.stocktakingHistory) {
      if (seen.has(reference)) errors.push(`${item.id}: referensi ${reference} duplikat pada history.`)
      seen.add(reference)
      const record = recordById.get(reference)
      if (!record) {
        errors.push(`${item.id}: referensi history ${reference} tidak ditemukan.`)
        continue
      }
      if (record.itemId !== item.id) {
        recordResults[reference] = false
        errors.push(`${item.id}: referensi ${reference} menunjuk ke barang ${record.itemId}.`)
        continue
      }
      historyRecords.push(record)
    }
    for (let index = 1; index < historyRecords.length; index += 1) {
      if (historyRecords[index].prevAmount !== historyRecords[index - 1].nextAmount) {
        recordResults[historyRecords[index].id] = false
        errors.push(`${item.id}: rantai stok putus sebelum ${historyRecords[index].id}.`)
      }
    }
    if (historyRecords.length && item.amount !== historyRecords[historyRecords.length - 1].nextAmount) {
      recordResults[historyRecords[historyRecords.length - 1].id] = false
      errors.push(`${item.id}: stok saat ini berbeda dari transaksi terakhir.`)
    }
  }
  return { valid: errors.length === 0, errors, recordResults }
}
