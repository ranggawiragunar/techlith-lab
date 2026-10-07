import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ItemFormDialog } from '../components/ItemFormDialog'
import { MovementDetailDialog } from '../components/MovementDetailDialog'
import { StockInboundDialog } from '../components/StockInboundDialog'
import { StockOutboundDialog } from '../components/StockOutboundDialog'
import { db } from '../db/database'
import { useAuth } from '../features/auth/context'
import { getItemByCode, updateItem, setItemArchived, type ItemInput } from '../services/itemService'
import { createInboundMovement, createOutboundMovement, listMovementsForItem } from '../services/stockMovementService'
import type { Item, StockMovement, User } from '../types/models'
import { formatQuantity } from '../utils/format'

function formatTimestamp(value: string): string {
  return new Date(value).toLocaleString()
}

export function ItemDetailPage() {
  const { itemCode = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState<Item | null>(null)
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [inboundOpen, setInboundOpen] = useState(false)
  const [outboundOpen, setOutboundOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null)
  const [feedback, setFeedback] = useState('')

  const reload = useCallback(async () => {
    setLoading(true)
    const [foundItem, allUsers] = await Promise.all([getItemByCode(itemCode), db.users.toArray()])
    if (!foundItem) {
      const legacyItem = await db.items.get(itemCode)
      setItem(null)
      setMovements([])
      setUsers(allUsers)
      setLoading(false)
      if (legacyItem?.code) navigate(`/admin/inventory/items/${encodeURIComponent(legacyItem.code)}`, { replace: true })
      return
    }
    const recent = await listMovementsForItem(foundItem.id, 5)
    setItem(foundItem ?? null)
    setMovements(recent)
    setUsers(allUsers)
    setLoading(false)
  }, [itemCode, navigate])

  useEffect(() => { void reload() }, [reload])

  async function saveChanges(input: ItemInput) {
    if (!item) return
    await updateItem(item.id, input)
    setEditing(false)
    setFeedback('Item details updated.')
    await reload()
  }

  async function submitInbound(amount: number, notes: string) {
    if (!user) throw new Error('Please sign in again before recording a movement.')
    if (!item) return
    await createInboundMovement({ itemId: item.id, amount, notes, actorUserId: user.id })
    setInboundOpen(false)
    setFeedback('Stock inbound recorded successfully.')
    await reload()
  }

  async function submitOutbound(amount: number, notes: string) {
    if (!user) throw new Error('Please sign in again before recording a movement.')
    if (!item) return
    await createOutboundMovement({ itemId: item.id, amount, notes, actorUserId: user.id })
    setOutboundOpen(false)
    setFeedback('Stock outbound berhasil diproses.')
    await reload()
  }

  async function archive() {
    if (!item) return
    await setItemArchived(item.id, true)
    setArchiveOpen(false)
    setFeedback('Item archived. Its stock history is preserved.')
    await reload()
  }

  async function restore() {
    if (!item) return
    await setItemArchived(item.id, false)
    setFeedback(`Item ${item.code} restored.`)
    await reload()
  }

  const actorName = (actorId: string) => {
    const actor = users.find((candidate) => candidate.id === actorId)
    return actor?.displayName || actor?.username || 'Pengguna tidak dikenal'
  }

  if (loading) return <div className="loading-screen">Loading item…</div>
  if (!item) return <div className="empty-state content-card"><div className="eyebrow">INVENTORY ITEM</div><h1>Item not found</h1><p>This item is not in the local inventory.</p><Link to="/admin/inventory/items" className="text-link">← Back to items</Link></div>

  return (
    <>
      <div className="page-heading detail-page-heading"><div><Link to="/admin/inventory/items" className="back-link">← Inventory items</Link><div className="eyebrow">Kode Barang · {item.code}</div><h1>{item.name}</h1><p>{item.description || 'No description provided.'}</p></div><span className={`status-badge ${item.isActive ? '' : 'archived'}`}><span className="status-dot" />{item.isActive ? 'Active' : 'Archived'}</span></div>
      {feedback && <div className="success-message page-feedback" role="status">✓ {feedback}<button aria-label="Dismiss message" onClick={() => setFeedback('')}>×</button></div>}
      <section className="detail-actions-bar content-card">
        <div className="detail-actions-copy"><span className="detail-overline">ITEM ACTIONS</span><span>Stock changes are recorded in movement history.</span></div>
        <div className="detail-actions"><button className="button button-quiet" onClick={() => setEditing(true)}>Edit item</button>{item.isActive ? <><button className="button button-primary" onClick={() => setInboundOpen(true)}>＋ Stock Inbound</button><button className="button button-quiet" onClick={() => setOutboundOpen(true)}>− Stock Outbound</button><button className="button button-danger" onClick={() => setArchiveOpen(true)}>Archive</button></> : <button className="button button-primary" onClick={() => void restore()}>Restore item</button>}</div>
      </section>
      <section className="detail-grid item-detail-grid">
        <article className="content-card detail-main"><div className="detail-overline">CURRENT STOCK</div><div className="detail-stock">{formatQuantity(item.stock)}<span> {item.unit}</span></div><p>Available quantity recorded in this browser.</p></article>
        <article className="content-card detail-fields"><h2>Item information</h2><dl><div><dt>Kode Barang</dt><dd className="mono">{item.code}</dd></div><div><dt>Category</dt><dd>{item.category}</dd></div><div><dt>Description</dt><dd>{item.description || '—'}</dd></div><div><dt>Unit of measure</dt><dd>{item.unit}</dd></div><div><dt>Status</dt><dd>{item.isActive ? 'Active' : 'Archived'}</dd></div><div><dt>Created</dt><dd>{formatTimestamp(item.createdAt)}</dd></div><div><dt>Last updated</dt><dd>{formatTimestamp(item.updatedAt)}</dd></div></dl></article>
      </section>
      <section className="content-card recent-movements-card"><div className="table-toolbar"><div><h2>Recent movements</h2><p>Latest stock activity for this item</p></div><Link className="text-link view-history-link" to={`/admin/inventory/history?item=${encodeURIComponent(item.code)}`}>View full history →</Link></div>{movements.length ? <div className="table-wrap"><table><thead><tr><th>KODE TRANSAKSI</th><th>DATE / TIME</th><th>TYPE</th><th>PREVIOUS</th><th>QUANTITY</th><th>NEXT STOCK</th><th>ACTOR</th><th /></tr></thead><tbody>{movements.map((movement) => <tr key={movement.id}><td><button className="movement-id-button mono" onClick={() => setSelectedMovement(movement)}>{movement.code}</button></td><td>{formatTimestamp(movement.createdAt)}</td><td><span className={`movement-type ${movement.type.toLowerCase()}`}>{movement.type}</span></td><td>{formatQuantity(movement.prevAmount)} {movement.itemUnitSnapshot || item.unit}</td><td>{formatQuantity(movement.amount)} {movement.itemUnitSnapshot || item.unit}</td><td>{formatQuantity(movement.nextAmount)} {movement.itemUnitSnapshot || item.unit}</td><td>{actorName(movement.actorUserId)}</td><td><button className="text-action" onClick={() => setSelectedMovement(movement)}>Details</button></td></tr>)}</tbody></table></div> : <div className="empty-state compact-empty"><div className="empty-icon history-icon">↺</div><h3>No movements for this item</h3><p>Stock activity will appear here after a movement is recorded.</p></div>}</section>
      {editing && <ItemFormDialog key={item.id} item={item} onClose={() => setEditing(false)} onSave={saveChanges} />}
      {inboundOpen && <StockInboundDialog item={item} onClose={() => setInboundOpen(false)} onSubmit={submitInbound} />}
      {outboundOpen && <StockOutboundDialog item={item} onClose={() => setOutboundOpen(false)} onSubmit={submitOutbound} />}
      {archiveOpen && <ConfirmDialog title="Archive this item?" description={`${item.name} (${item.code}) will be hidden from the Active list and unavailable for new stock movements. Its current stock and movement history will remain available.`} confirmLabel="Archive item" danger onCancel={() => setArchiveOpen(false)} onConfirm={() => void archive()} />}
      {selectedMovement && <MovementDetailDialog movement={selectedMovement} actorName={actorName(selectedMovement.actorUserId)} onClose={() => setSelectedMovement(null)} />}
    </>
  )
}
