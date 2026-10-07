import { useState, type FormEvent } from 'react'
import type { Item } from '../types/models'
import type { ItemInput } from '../services/itemService'

interface ItemFormDialogProps {
  item?: Item
  onClose: () => void
  onSave: (input: ItemInput) => Promise<void>
}

export function ItemFormDialog({ item, onClose, onSave }: ItemFormDialogProps) {
  const [name, setName] = useState(item?.name ?? '')
  const [category, setCategory] = useState(item?.category ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [unit, setUnit] = useState(item?.unit ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSave({ name, category, description, unit })
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this item.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dialog-backdrop">
      <section className="form-dialog" role="dialog" aria-modal="true" aria-labelledby="item-form-title">
        <div className="dialog-heading"><div><div className="eyebrow">INVENTORY ITEM</div><h2 id="item-form-title">{item ? 'Edit item' : 'Add item'}</h2></div><button className="icon-button" aria-label="Close" onClick={onClose}>×</button></div>
        <form className="dialog-form" onSubmit={(event) => void submit(event)}>
          {item && <div className="readonly-field"><span>Kode Barang</span><strong className="mono">{item.code}</strong></div>}
          <label htmlFor="item-name">Name <span>*</span></label><input id="item-name" autoFocus value={name} onChange={(event) => setName(event.target.value)} maxLength={100} required />
          <label htmlFor="item-category">Category <span>*</span></label><input id="item-category" value={category} onChange={(event) => setCategory(event.target.value)} maxLength={60} required />
          <label htmlFor="item-unit">Unit <span>*</span></label><input id="item-unit" value={unit} onChange={(event) => setUnit(event.target.value)} maxLength={30} placeholder="e.g. meter, pcs" required />
          <label htmlFor="item-description">Description</label><textarea id="item-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={3} maxLength={500} />
          <div className="stock-guidance">{item ? <>Current stock <strong>{item.stock} {item.unit}</strong> · stock changes through inventory movements.</> : <>Opening stock is 0. Use Stock Inbound to add stock.</>}</div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="dialog-actions"><button type="button" className="button button-quiet" onClick={onClose} disabled={saving}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? 'Saving…' : item ? 'Save changes' : 'Create item'}</button></div>
        </form>
      </section>
    </div>
  )
}
