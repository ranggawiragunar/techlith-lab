import { useState } from 'react'
import { resetTestingData } from '../services/resetTestingData'

export function TestingPage() {
  const [message, setMessage] = useState('')
  const [resetting, setResetting] = useState(false)
  const [confirming, setConfirming] = useState(false)
  async function handleReset() {
    setResetting(true)
    setMessage('')
    try {
      await resetTestingData()
      setMessage('Testing data has been reset to the seed baseline.')
      setConfirming(false)
    } catch {
      setMessage('Reset could not be completed. Please try again.')
    } finally {
      setResetting(false)
    }
  }
  return <><div className="page-heading"><div><div className="eyebrow">ADMINISTRATION</div><h1>Testing utilities</h1><p>Tools for restoring a clean local learning environment.</p></div></div><section className="content-card utility-card"><div className="utility-icon">⟳</div><div className="utility-copy"><div className="eyebrow">DATA MANAGEMENT</div><h2>Reset testing data</h2><p>Clear local users, inventory records, and stock movement history, then restore the original seeded admin and inventory baseline. Your current login session is preserved.</p>{message && <div className="success-message" role="status">✓ {message}</div>}</div><button className="button button-danger" onClick={() => setConfirming(true)} disabled={resetting}>{resetting ? 'Resetting…' : 'Reset data'}</button></section><div className="notice-card"><span>i</span><p>This action only affects data stored in this browser. It cannot be undone.</p></div>{confirming && <div className="confirm-backdrop"><section className="confirm-dialog" role="alertdialog" aria-labelledby="confirm-title" aria-describedby="confirm-description"><div className="utility-icon">!</div><h2 id="confirm-title">Reset testing data?</h2><p id="confirm-description">This clears local inventory changes and stock history, then restores the seeded admin and inventory baseline. Your login session will stay active.</p><div className="confirm-actions"><button className="button button-quiet" onClick={() => setConfirming(false)} disabled={resetting}>Cancel</button><button className="button button-danger" onClick={() => void handleReset()} disabled={resetting}>{resetting ? 'Resetting…' : 'Confirm reset'}</button></div></section></div>}</>
}
