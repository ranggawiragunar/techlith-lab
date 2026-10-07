import { useState, type FormEvent } from 'react'
import type { Item } from '../types/models'
import { allowsFractionalQuantity } from '../utils/quantity'

interface StockInboundDialogProps {
  item: Item
  onClose: () => void
  onSubmit: (amount: number, notes: string) => Promise<void>
}

export function StockInboundDialog({ item, onClose, onSubmit }: StockInboundDialogProps) {
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
      setError('Enter an amount greater than zero.')
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
      setError(submitError instanceof Error ? submitError.message : 'The inbound movement could not be saved.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dialog-backdrop">
      <section className="form-dialog" role="dialog" aria-modal="true" aria-labelledby="inbound-title">
        <div className="dialog-heading"><div><div className="eyebrow">STOCK INBOUND</div><h2 id="inbound-title">Add stock</h2></div><button className="icon-button" aria-label="Close" onClick={onClose}>×</button></div>
        <div className="movement-context"><strong>{item.name}</strong><span className="mono">Kode Barang: {item.code}</span><span>Current stock <b>{item.stock} {item.unit}</b></span></div>
        <form className="dialog-form" noValidate onSubmit={(event) => void submit(event)}>
          <label htmlFor="inbound-amount">Amount ({item.unit}) <span>*</span></label><input id="inbound-amount" type="number" min={fractional ? '0.001' : '1'} step={fractional ? '0.001' : '1'} inputMode={fractional ? 'decimal' : 'numeric'} autoFocus value={amount} onChange={(event) => setAmount(event.target.value)} required />
          <label htmlFor="inbound-notes">Notes <small>Optional</small></label><textarea id="inbound-notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} maxLength={500} placeholder="Add a note for this movement" />
          <div className="stock-guidance">Stock and movement history are saved together.</div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="dialog-actions"><button type="button" className="button button-quiet" onClick={onClose} disabled={submitting}>Cancel</button><button type="submit" className="button button-primary" disabled={submitting}>{submitting ? 'Saving…' : 'Save inbound'}</button></div>
        </form>
      </section>
    </div>
  )
}
