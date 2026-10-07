import { useState, type FormEvent } from 'react'
import type { Item } from '../types/models'
import { allowsFractionalQuantity } from '../utils/quantity'

interface StockOutboundDialogProps {
  item: Item
  onClose: () => void
  onSubmit: (amount: number, notes: string) => Promise<void>
}

export function StockOutboundDialog({ item, onClose, onSubmit }: StockOutboundDialogProps) {
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const fractional = allowsFractionalQuantity(item.unit)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const quantity = Number(amount)
    if (!amount.trim() || !Number.isFinite(quantity) || quantity <= 0) {
      setError('Jumlah outbound harus lebih besar dari 0.')
      return
    }
    if (Number(quantity.toFixed(3)) !== quantity) {
      setError('Use no more than three decimal places.')
      return
    }
    if (!fractional && !Number.isInteger(quantity)) {
      setError(`Enter a whole number for ${item.unit}.`)
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(quantity, notes)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'The outbound movement could not be saved.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dialog-backdrop">
      <section className="form-dialog" role="dialog" aria-modal="true" aria-labelledby="outbound-title">
        <div className="dialog-heading"><div><div className="eyebrow">STOCK OUTBOUND</div><h2 id="outbound-title">Process outbound</h2></div><button className="icon-button" aria-label="Close" onClick={onClose}>×</button></div>
        <div className="movement-context"><strong>{item.name}</strong><span className="mono">Kode Barang: {item.code}</span><span>Stok Saat Ini <b>{item.stock} {item.unit}</b></span></div>
        <form className="dialog-form" noValidate onSubmit={(event) => void submit(event)}>
          <label htmlFor="outbound-amount">Jumlah Outbound ({item.unit}) <span>*</span></label><input id="outbound-amount" type="number" step={fractional ? '0.001' : '1'} inputMode={fractional ? 'decimal' : 'numeric'} autoFocus value={amount} onChange={(event) => setAmount(event.target.value)} required />
          <label htmlFor="outbound-notes">Catatan <small>Optional</small></label><textarea id="outbound-notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} maxLength={500} placeholder="Add a note for this movement" />
          <div className="stock-guidance">Stock and movement history are saved together.</div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="dialog-actions"><button type="button" className="button button-quiet" onClick={onClose} disabled={submitting}>Cancel</button><button type="submit" className="button button-primary" disabled={submitting}>{submitting ? 'Processing…' : 'Proses Outbound'}</button></div>
        </form>
      </section>
    </div>
  )
}
