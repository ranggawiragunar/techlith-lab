interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel: string
  danger?: boolean
  busy?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({ title, description, confirmLabel, danger = false, busy = false, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <div className="confirm-backdrop">
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description">
        <div className="utility-icon">!</div>
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-description">{description}</p>
        <div className="confirm-actions">
          <button className="button button-quiet" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className={`button ${danger ? 'button-danger' : 'button-primary'}`} onClick={onConfirm} disabled={busy}>{busy ? 'Please wait…' : confirmLabel}</button>
        </div>
      </section>
    </div>
  )
}
