import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useClassroomLab } from '../features/session3/context'

interface TransactionFeedback {
  accepted: boolean
  message: string
  amount?: number
}

const DECIMAL_QUANTITY = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/

export function Session3BoundaryPage() {
  const { items, submitOutbound, resetLabData } = useClassroomLab()
  const [selectedCode, setSelectedCode] = useState(items[0]?.code ?? '')
  const [quantity, setQuantity] = useState('')
  const [feedback, setFeedback] = useState<TransactionFeedback | null>(null)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const selectedItem = items.find((item) => item.code === selectedCode) ?? items[0]

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const rawQuantity = quantity.trim()

    if (!rawQuantity) {
      setFeedback({ accepted: false, message: 'Enter an outbound quantity.' })
      return
    }
    if (!DECIMAL_QUANTITY.test(rawQuantity)) {
      setFeedback({ accepted: false, message: 'Enter a valid numeric quantity.' })
      return
    }

    const amount = Number(rawQuantity)
    if (!Number.isFinite(amount)) {
      setFeedback({ accepted: false, message: 'Enter a finite numeric quantity.' })
      return
    }
    if (!selectedItem) {
      setFeedback({ accepted: false, message: 'Select an inventory item.' })
      return
    }

    const result = submitOutbound(selectedItem.code, amount)
    if (result.accepted) {
      setFeedback({ accepted: true, message: 'Transaction completed.', amount })
      return
    }

    const messages = {
      'invalid-quantity': 'Enter a finite numeric quantity.',
      'non-positive': 'Quantity must be greater than zero.',
      'exceeds-stock': 'Quantity exceeds available stock.',
      'item-not-found': 'Select an available inventory item.',
    } as const
    setFeedback({ accepted: false, message: messages[result.reason], amount })
  }

  function handleReset() {
    resetLabData()
    setQuantity('')
    setFeedback(null)
    setConfirmingReset(false)
  }

  return (
    <>
      <Link className="back-link" to="/admin/classroom/session-3">← Session 3 classroom</Link>
      <div className="page-heading session3-page-heading">
        <div className="boundary-heading-copy">
          <div className="eyebrow">SESSION 3 ACTIVITY</div>
          <h1>Boundary Testing</h1>
          <p>Perform outbound transactions against the classroom inventory and observe the resulting stock.</p>
        </div>
        <button className="button button-danger" type="button" onClick={() => setConfirmingReset(true)}>Reset Lab Data</button>
      </div>

      <section className="content-card boundary-item-card" aria-labelledby="boundary-item-title">
        <div className="boundary-section-heading">
          <div>
            <h2 id="boundary-item-title">Classroom item</h2>
            <p>Select an item to view its current stock.</p>
          </div>
          <div className="boundary-selector">
            <label htmlFor="boundary-item-select">Inventory item</label>
            <select
              id="boundary-item-select"
              value={selectedItem?.code ?? ''}
              onChange={(event) => {
                setSelectedCode(event.target.value)
                setFeedback(null)
              }}
            >
              {items.map((item) => (
                <option key={item.code} value={item.code}>{item.code} · {item.name}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedItem ? (
          <dl className="boundary-stock-summary">
            <div><dt>Item code</dt><dd className="mono">{selectedItem.code}</dd></div>
            <div><dt>Item name</dt><dd>{selectedItem.name}</dd></div>
            <div><dt>Current stock</dt><dd><strong className="stock-number">{selectedItem.stock}</strong> {selectedItem.unit}</dd></div>
          </dl>
        ) : <p className="boundary-empty">No classroom items are available.</p>}
      </section>

      <section className="content-card boundary-form-card" aria-labelledby="boundary-form-title">
        <div className="boundary-section-heading">
          <div>
            <h2 id="boundary-form-title">Outbound transaction</h2>
            <p>Enter a quantity and submit to observe the inventory response.</p>
          </div>
        </div>
        <form className="boundary-form" noValidate onSubmit={handleSubmit}>
          <div className="boundary-quantity-field">
            <label htmlFor="boundary-quantity">Outbound quantity{selectedItem ? ` (${selectedItem.unit})` : ''}</label>
            <input
              id="boundary-quantity"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              aria-describedby="boundary-quantity-hint"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
            <span id="boundary-quantity-hint" className="boundary-hint">Enter a quantity to attempt an outbound transaction.</span>
          </div>
          <button className="button button-primary boundary-submit" type="submit">Submit outbound</button>
        </form>

        {feedback && (
          <div className={`boundary-feedback ${feedback.accepted ? 'accepted' : 'rejected'}`} role={feedback.accepted ? 'status' : 'alert'} aria-live={feedback.accepted ? 'polite' : 'assertive'}>
            <strong>{feedback.message}</strong>
            {feedback.amount !== undefined && <span>Submitted quantity: {feedback.amount}{selectedItem ? ` ${selectedItem.unit}` : ''}</span>}
            {selectedItem && <span>Current stock: {selectedItem.stock} {selectedItem.unit}</span>}
          </div>
        )}
      </section>

      {confirmingReset && (
        <ConfirmDialog
          title="Reset Session 3 lab data?"
          description="Restore the three classroom items to their starting stock values. Main inventory data and history will not be changed."
          confirmLabel="Reset Lab Data"
          danger
          onCancel={() => setConfirmingReset(false)}
          onConfirm={handleReset}
        />
      )}
    </>
  )
}
