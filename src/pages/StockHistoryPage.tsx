import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MovementDetailDialog } from '../components/MovementDetailDialog'
import { db } from '../db/database'
import { listStockMovements } from '../services/stockMovementService'
import type { Item, StockMovement, User } from '../types/models'
import { formatQuantity } from '../utils/format'

type MovementFilter = 'ALL' | 'INBOUND' | 'OUTBOUND'

function sourceLabel(source: StockMovement['source']): string {
  return source === 'MANUAL_STOCK_INBOUND' ? 'Manual inbound' : 'Manual outbound'
}

export function StockHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [itemFilter, setItemFilter] = useState(searchParams.get('item') ?? '')
  const [typeFilter, setTypeFilter] = useState<MovementFilter>('ALL')
  const [search, setSearch] = useState('')
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null)

  useEffect(() => {
    void Promise.all([listStockMovements(), db.items.toArray(), db.users.toArray()]).then(([history, allItems, allUsers]) => {
      setMovements(history)
      setItems(allItems)
      setUsers(allUsers)
    })
  }, [])

  useEffect(() => {
    if (!itemFilter || items.length === 0) return
    const selected = items.find((item) => item.code === itemFilter) ?? items.find((item) => item.id === itemFilter)
    const publicCode = selected?.code ?? ''
    if (publicCode === itemFilter) return
    setItemFilter(publicCode)
    const next = new URLSearchParams(searchParams)
    if (publicCode) next.set('item', publicCode)
    else next.delete('item')
    setSearchParams(next, { replace: true })
  }, [itemFilter, items, searchParams, setSearchParams])

  const filteredMovements = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return movements.filter((movement) => {
      if (itemFilter && movement.itemCodeSnapshot !== itemFilter) return false
      if (typeFilter !== 'ALL' && movement.type !== typeFilter) return false
      if (!query) return true
      return `${movement.code} ${movement.itemCodeSnapshot ?? ''} ${movement.itemNameSnapshot}`.toLocaleLowerCase().includes(query)
    })
  }, [itemFilter, movements, search, typeFilter])

  function changeItemFilter(value: string) {
    setItemFilter(value)
    const next = new URLSearchParams(searchParams)
    if (value) next.set('item', value)
    else next.delete('item')
    setSearchParams(next, { replace: true })
  }

  const actorName = (actorId: string) => {
    const actor = users.find((user) => user.id === actorId)
    return actor?.displayName || actor?.username || 'Pengguna tidak dikenal'
  }

  return (
    <>
      <div className="page-heading"><div><div className="eyebrow">INVENTORY</div><h1>Stock history</h1><p>A complete record of inventory movements in this browser.</p></div></div>
      <section className="content-card history-card">
        <div className="table-toolbar history-toolbar"><div><h2>Movement history</h2><p>{filteredMovements.length} of {movements.length} records · newest first</p></div><div className="filter-controls"><label className="filter-search" aria-label="Search movements"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Kode Barang or Kode Transaksi" /></label><label className="sr-only" htmlFor="history-item-filter">Item</label><select id="history-item-filter" value={itemFilter} onChange={(event) => changeItemFilter(event.target.value)}><option value="">All items</option>{items.map((item) => <option key={item.id} value={item.code}>{item.name} · Kode Barang: {item.code}{item.isActive ? '' : ' · Archived'}</option>)}</select><label className="sr-only" htmlFor="history-type-filter">Movement type</label><select id="history-type-filter" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as MovementFilter)}><option value="ALL">All types</option><option value="INBOUND">Inbound</option><option value="OUTBOUND">Outbound</option></select></div></div>
        {filteredMovements.length ? <div className="table-wrap"><table className="history-table"><thead><tr><th>KODE TRANSAKSI</th><th>DATE / TIME</th><th>ITEM</th><th>TYPE</th><th>PREVIOUS</th><th>QUANTITY</th><th>NEXT STOCK</th><th>ACTOR</th><th>SOURCE</th><th /></tr></thead><tbody>{filteredMovements.map((movement) => <tr key={movement.id}><td><button className="movement-id-button mono" onClick={() => setSelectedMovement(movement)}>{movement.code}</button></td><td>{new Date(movement.createdAt).toLocaleString()}</td><td>{movement.itemCodeSnapshot ? <Link className="history-item-link" to={`/admin/inventory/items/${movement.itemCodeSnapshot}`}><strong>{movement.itemNameSnapshot || 'Nama barang tidak tersedia'}</strong><span className="mono">Kode Barang · {movement.itemCodeSnapshot}</span></Link> : <div className="history-item-link"><strong>{movement.itemNameSnapshot || 'Nama barang tidak tersedia'}</strong><span>Kode barang tidak tersedia</span></div>}</td><td><span className={`movement-type ${movement.type.toLowerCase()}`}>{movement.type}</span></td><td>{formatQuantity(movement.prevAmount)} {movement.itemUnitSnapshot || items.find((item) => item.id === movement.itemId)?.unit || ''}</td><td><strong>{formatQuantity(movement.amount)}</strong> {movement.itemUnitSnapshot || items.find((item) => item.id === movement.itemId)?.unit || ''}</td><td>{formatQuantity(movement.nextAmount)} {movement.itemUnitSnapshot || items.find((item) => item.id === movement.itemId)?.unit || ''}</td><td>{actorName(movement.actorUserId)}</td><td>{sourceLabel(movement.source)}</td><td><button className="text-action" onClick={() => setSelectedMovement(movement)}>Details</button></td></tr>)}</tbody></table></div> : movements.length ? <div className="empty-state"><div className="empty-icon">⌕</div><h3>No movements match these filters</h3><p>Change the item, type, or search filters to see more records.</p></div> : <div className="empty-state"><div className="empty-icon history-icon">↺</div><h3>No stock movements yet</h3><p>When inventory activity is recorded, each movement will appear here.</p><span className="empty-hint">Your movement history is saved locally.</span></div>}
        <div className="table-footer">History is stored on this device <span>Movement records are read-only</span></div>
      </section>
      {selectedMovement && <MovementDetailDialog movement={selectedMovement} actorName={actorName(selectedMovement.actorUserId)} onClose={() => setSelectedMovement(null)} />}
    </>
  )
}
