import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../db/database'
import type { Item, StockMovement } from '../types/models'

export function DashboardPage() {
  const [items, setItems] = useState<Item[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  useEffect(() => {
    void Promise.all([db.items.toArray(), db.stockMovements.toArray()]).then(([allItems, allMovements]) => {
      setItems(allItems)
      setMovements(allMovements)
    })
  }, [])
  const activeCount = items.filter((item) => item.isActive).length
  const archivedCount = items.length - activeCount
  const inboundCount = movements.filter((movement) => movement.type === 'INBOUND').length
  return (
    <>
      <div className="page-heading"><div><div className="eyebrow">OVERVIEW</div><h1>Dashboard</h1><p>A quick look at your local inventory workspace.</p></div><Link className="pill" to="/admin/inventory/items"><span className="status-dot" />Inventory ready</Link></div>
      <section className="stats-grid dashboard-stats">
        <article className="stat-card"><span className="stat-icon indigo">▦</span><div className="stat-label">Active items</div><div className="stat-value">{activeCount}<span>items</span></div><div className="stat-foot">Available for inventory activity</div></article>
        <article className="stat-card"><span className="stat-icon amber">◫</span><div className="stat-label">Archived items</div><div className="stat-value">{archivedCount}<span>items</span></div><div className="stat-foot">Records preserved in this lab</div></article>
        <article className="stat-card"><span className="stat-icon teal">↺</span><div className="stat-label">Stock movements</div><div className="stat-value">{movements.length}<span>records</span></div><div className="stat-foot">Inbound and outbound activity</div></article>
        <article className="stat-card"><span className="stat-icon blue">↓</span><div className="stat-label">Inbound movements</div><div className="stat-value">{inboundCount}<span>records</span></div><div className="stat-foot">Recorded stock additions</div></article>
      </section>
      <section className="content-card welcome-card"><div className="welcome-copy"><div className="eyebrow">YOUR LABORATORY</div><h2>Ready for the work ahead.</h2><p>Manage your local inventory, record stock additions, and review a complete movement history for every item.</p><Link className="button button-primary" to="/admin/inventory/items">Browse inventory <span>→</span></Link></div><div className="welcome-illustration"><div className="illustration-ring ring-one" /><div className="illustration-ring ring-two" /><div className="illustration-card"><span>ACTIVE</span><strong>{activeCount}</strong><small>ITEMS</small></div><div className="spark spark-a">✦</div><div className="spark spark-b">✧</div></div></section>
      <div className="dashboard-footnote">Application data is stored in this browser using IndexedDB.</div>
    </>
  )
}
