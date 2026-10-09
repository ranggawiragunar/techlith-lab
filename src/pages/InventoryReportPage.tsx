import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getInventoryReport, type InventoryReportData } from '../services/inventoryReportService'
import { formatQuantity } from '../utils/format'

export function InventoryReportPage() {
  const [report, setReport] = useState<InventoryReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadReport = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      setReport(await getInventoryReport())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadReport()
  }, [loadReport])

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">INVENTORY</div>
          <h1>Inventory Report</h1>
          <p>A consolidated view of current stock and recorded movements.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-screen" role="status">Loading inventory report…</div>
      ) : error ? (
        <section className="content-card report-state-card" role="alert">
          <h2>Inventory report unavailable</h2>
          <p>The local inventory data could not be loaded.</p>
          <button className="button button-primary" onClick={() => void loadReport()}>Retry</button>
        </section>
      ) : report ? (
        <>
          <section className="report-summary" aria-label="Inventory report summary">
            <article className="stat-card report-summary-card">
              <span className="stat-icon indigo">▦</span>
              <div className="stat-label">Inventory items</div>
              <div className="stat-value">{report.rows.length}<span>items</span></div>
              <div className="stat-foot">Active and archived records</div>
            </article>
            <article className="stat-card report-summary-card">
              <span className="stat-icon teal">↺</span>
              <div className="stat-label">Recorded movements</div>
              <div className="stat-value">{report.movementCount}<span>records</span></div>
              <div className="stat-foot">In the current local history</div>
            </article>
          </section>

          <section className="content-card inventory-report-card">
            <div className="table-toolbar">
              <div>
                <h2>Inventory by item</h2>
                <p>Current stock and movement totals are shown separately.</p>
              </div>
            </div>
            {report.rows.length ? (
              <div className="table-wrap">
                <table className="inventory-report-table">
                  <thead>
                    <tr>
                      <th>ITEM CODE</th>
                      <th>ITEM NAME</th>
                      <th>CATEGORY</th>
                      <th>CURRENT STOCK</th>
                      <th>UNIT</th>
                      <th>TOTAL INBOUND</th>
                      <th>TOTAL OUTBOUND</th>
                      <th>MOVEMENTS</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.rows.map(({ item, totalInbound, totalOutbound, movementCount }) => (
                      <tr key={item.id}>
                        <td><Link className="report-code-link mono" to={`/admin/inventory/items/${item.code}`}>{item.code}</Link></td>
                        <td><Link className="report-name-link" to={`/admin/inventory/items/${item.code}`}>{item.name}</Link></td>
                        <td>{item.category}</td>
                        <td><strong className="stock-number">{formatQuantity(item.stock)}</strong></td>
                        <td>{item.unit}</td>
                        <td>{formatQuantity(totalInbound)}</td>
                        <td>{formatQuantity(totalOutbound)}</td>
                        <td>{movementCount}</td>
                        <td><span className={`status-badge ${item.isActive ? '' : 'archived'}`}><span className="status-dot" />{item.isActive ? 'Active' : 'Archived'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state report-empty-state">
                <div className="empty-icon">▦</div>
                <h3>No inventory items yet</h3>
                <p>Items will appear here after they are added to the inventory.</p>
                <Link className="text-link" to="/admin/inventory/items">Open inventory items</Link>
              </div>
            )}
            <p className="report-note">Transaction totals reflect movements recorded in the current local history. Current stock may include initial stock.</p>
          </section>
        </>
      ) : null}
    </>
  )
}
