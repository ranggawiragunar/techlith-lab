import type { StockMovement } from '../types/models'
import { formatQuantity } from '../utils/format'

interface MovementDetailDialogProps {
  movement: StockMovement
  actorName?: string
  onClose: () => void
}

export function MovementDetailDialog({ movement, actorName, onClose }: MovementDetailDialogProps) {
  const itemName = movement.itemNameSnapshot || 'Nama barang tidak tersedia'
  const unit = movement.itemUnitSnapshot || 'unit'
  const source = movement.source === 'MANUAL_STOCK_INBOUND' ? 'Manual inbound' : 'Manual outbound'
  return (
    <div className="dialog-backdrop">
      <section className="form-dialog movement-dialog" role="dialog" aria-modal="true" aria-labelledby="movement-detail-title">
        <div className="dialog-heading"><div><div className="eyebrow">INVENTORY MOVEMENT</div><h2 id="movement-detail-title">Movement details</h2></div><button className="icon-button" aria-label="Close" onClick={onClose}>×</button></div>
        <div className="movement-detail-identity"><div><strong>{itemName}</strong><span className="mono">Kode Barang: {movement.itemCodeSnapshot || 'Kode barang tidak tersedia'}</span></div><span className={`movement-type ${movement.type.toLowerCase()}`}>{movement.type}</span></div>
        <dl className="movement-detail-list">
          <div><dt>Kode Transaksi</dt><dd className="mono">{movement.code}</dd></div>
          <div><dt>Date / time</dt><dd>{new Date(movement.createdAt).toLocaleString()}</dd></div>
          <div><dt>Previous stock</dt><dd>{formatQuantity(movement.prevAmount)} {unit}</dd></div>
          <div><dt>Quantity</dt><dd>{formatQuantity(movement.amount)} {unit}</dd></div>
          <div><dt>Next stock</dt><dd>{formatQuantity(movement.nextAmount)} {unit}</dd></div>
          <div><dt>Unit snapshot</dt><dd>{unit}</dd></div>
          <div><dt>Actor</dt><dd>{actorName || 'Pengguna tidak dikenal'}</dd></div>
          <div><dt>Source</dt><dd>{source}</dd></div>
          <div><dt>Notes</dt><dd>{movement.notes || '—'}</dd></div>
        </dl>
        <div className="dialog-actions"><button className="button button-primary" onClick={onClose}>Close</button></div>
      </section>
    </div>
  )
}
