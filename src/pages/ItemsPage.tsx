import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ItemFormDialog } from '../components/ItemFormDialog'
import type { Item } from '../types/models'
import { createItem, listItems, setItemArchived, updateItem, type ItemInput, type ItemStatusFilter } from '../services/itemService'
import { formatQuantity } from '../utils/format'

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString()
}

export function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [allItems, setAllItems] = useState<Item[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState<ItemStatusFilter>('ACTIVE')
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [adding, setAdding] = useState(false)
  const [archivingItem, setArchivingItem] = useState<Item | null>(null)
  const [feedback, setFeedback] = useState('')
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    const [visibleItems, everyItem] = await Promise.all([
      listItems({ search, category, status }),
      listItems({ status: 'ALL' }),
    ])
    setItems(visibleItems)
    setAllItems(everyItem)
  }, [search, category, status])

  useEffect(() => { void refresh() }, [refresh])

  async function saveItem(input: ItemInput) {
    const result = editingItem ? await updateItem(editingItem.id, input) : await createItem(input)
    setAdding(false)
    setEditingItem(null)
    setFeedback(`${result.name} (Kode Barang ${result.code}) ${editingItem ? 'updated' : 'created'} successfully.`)
    await refresh()
  }

  async function archiveItem() {
    if (!archivingItem) return
    setBusy(true)
    try {
      await setItemArchived(archivingItem.id, true)
      setFeedback(`${archivingItem.name} (${archivingItem.code}) archived.`)
      setArchivingItem(null)
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  async function restoreItem(item: Item) {
    setBusy(true)
    try {
      await setItemArchived(item.id, false)
      setFeedback(`${item.name} (${item.code}) restored.`)
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  const categories = [...new Set(allItems.map((item) => item.category))].sort((a, b) => a.localeCompare(b))

  return (
    <>
      <div className="page-heading"><div><div className="eyebrow">INVENTORY</div><h1>Items</h1><p>Manage materials and supplies in your local lab.</p></div><button className="button button-primary" onClick={() => { setEditingItem(null); setAdding(true) }}>＋ Add item</button></div>
      {feedback && <div className="success-message page-feedback" role="status">✓ {feedback}<button aria-label="Dismiss message" onClick={() => setFeedback('')}>×</button></div>}
      <section className="content-card table-card item-list-card">
        <div className="table-toolbar item-filters"><div><h2>Inventory list</h2><p>{items.length} {items.length === 1 ? 'record' : 'records'} · stock changes through movements</p></div><div className="filter-controls"><label className="filter-search" aria-label="Search items"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or Kode Barang" /></label><label className="sr-only" htmlFor="category-filter">Category</label><select id="category-filter" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((value) => <option key={value}>{value}</option>)}</select><label className="sr-only" htmlFor="status-filter">Status</label><select id="status-filter" value={status} onChange={(event) => setStatus(event.target.value as ItemStatusFilter)}><option value="ACTIVE">Active</option><option value="ARCHIVED">Archived</option><option value="ALL">All statuses</option></select></div></div>
        <div className="table-wrap"><table className="inventory-table"><thead><tr><th>ITEM</th><th>CATEGORY</th><th>CURRENT STOCK</th><th>STATUS</th><th>UPDATED</th><th>ACTIONS</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><div className="item-name-cell"><div className={`item-thumb tone-${item.id.slice(-1)}`}>{item.name.slice(0, 1)}</div><div><Link to={`/admin/inventory/items/${item.code}`}>{item.name}</Link><span>Kode Barang · {item.code}</span></div></div></td><td><span className="category-label">{item.category}</span></td><td><strong className="stock-number">{formatQuantity(item.stock)}</strong><span className="stock-unit"> {item.unit}</span></td><td><span className={`status-badge ${item.isActive ? '' : 'archived'}`}><span className="status-dot" />{item.isActive ? 'Active' : 'Archived'}</span></td><td>{formatDate(item.updatedAt)}</td><td><div className="row-actions"><Link className="text-action" to={`/admin/inventory/items/${item.code}`}>View</Link><button className="text-action" onClick={() => { setAdding(false); setEditingItem(item) }}>Edit</button>{item.isActive ? <button className="text-action danger-text" onClick={() => setArchivingItem(item)}>Archive</button> : <button className="text-action" onClick={() => void restoreItem(item)} disabled={busy}>Restore</button>}</div></td></tr>)}</tbody></table></div>
        {items.length === 0 && <div className="empty-state"><div className="empty-icon">▦</div><h3>No items match these filters</h3><p>Try another search or status, or add an item to the inventory.</p><button className="button button-primary empty-action" onClick={() => { setEditingItem(null); setAdding(true) }}>Add item</button></div>}
        <div className="table-footer">Showing <strong>{items.length}</strong> inventory records <span>Stored on this device</span></div>
      </section>
      {(adding || editingItem) && <ItemFormDialog key={editingItem?.id ?? 'new'} item={editingItem ?? undefined} onClose={() => { setAdding(false); setEditingItem(null) }} onSave={saveItem} />}
      {archivingItem && <ConfirmDialog title="Archive this item?" description={`${archivingItem.name} (${archivingItem.code}) will be hidden from the Active list and unavailable for new stock movements. Its stock and history will be preserved.`} confirmLabel="Archive item" danger busy={busy} onCancel={() => setArchivingItem(null)} onConfirm={() => void archiveItem()} />}
    </>
  )
}
