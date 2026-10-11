import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/client'
import { executeStocktaking } from '../services/stocktaking'
import type { FailureMode, FlowName, ItemRecord, RuntimeMessage, StocktakingRecord, TransactionType } from '../types'

interface StoredItem extends ItemRecord { id: string }
interface StoredStocktaking extends StocktakingRecord { id: string }

export function App() {
  const [items, setItems] = useState<StoredItem[]>([])
  const [stocktakings, setStocktakings] = useState<StoredStocktaking[]>([])
  const [connected, setConnected] = useState(false)
  const [connectionError, setConnectionError] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('ITM-001')
  const [type, setType] = useState<TransactionType>('inbound')
  const [amount, setAmount] = useState('5')
  const [flow, setFlow] = useState<FlowName>('baseline')
  const [failureMode, setFailureMode] = useState<FailureMode>('normal')
  const [messages, setMessages] = useState<RuntimeMessage[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let receivedItems = false
    let receivedStocktakings = false
    const stopItems = onSnapshot(collection(db, 'items'), (snapshot) => {
      receivedItems = true
      setItems(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as StoredItem)))
      if (receivedItems && receivedStocktakings) {
        setConnected(true)
        setConnectionError('')
      }
    }, (error) => setConnectionError(error.message))
    const stopStocktakings = onSnapshot(collection(db, 'stocktakings'), (snapshot) => {
      receivedStocktakings = true
      setStocktakings(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as StoredStocktaking)))
      if (receivedItems && receivedStocktakings) {
        setConnected(true)
        setConnectionError('')
      }
    }, (error) => setConnectionError(error.message))

    return () => {
      stopItems()
      stopStocktakings()
    }
  }, [])

  const selectedItem = items.find((item) => item.id === selectedItemId)
  const sortedStocktakings = useMemo(
    () => [...stocktakings].sort((left, right) => right.dateCreated.toMillis() - left.dateCreated.toMillis()),
    [stocktakings],
  )
  const inbound = sortedStocktakings.filter((entry) => entry.type === 'inbound')
  const outbound = sortedStocktakings.filter((entry) => entry.type === 'outbound')

  function addMessage(kind: RuntimeMessage['kind'], text: string) {
    setMessages((current) => [{ id: crypto.randomUUID(), kind, text, createdAt: new Date().toLocaleTimeString('id-ID') }, ...current])
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!connected) {
      addMessage('warning', 'Emulator belum tersambung. Tidak ada transaksi yang dijalankan.')
      return
    }
    const parsedAmount = Number(amount)
    setSubmitting(true)
    try {
      await executeStocktaking(selectedItemId, type, parsedAmount, flow, failureMode, addMessage)
    } catch (error) {
      addMessage('warning', error instanceof Error ? error.message : String(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">CLASSROOM BUILD S5 · PENGUJIAN PERANGKAT LUNAK</p>
          <h1>Integration Testing Stocktaking</h1>
          <p className="lede">Periksa konsistensi data lintas UI, items, stocktakings, dan stocktakingHistory.</p>
        </div>
        <a className="text-link" href="http://127.0.0.1:4000" target="_blank" rel="noreferrer">Buka Emulator UI ↗</a>
      </header>

      <section className={`environment-banner ${connected ? 'is-connected' : 'is-disconnected'}`} aria-live="polite">
        <span className="status-dot" />
        <div>
          <strong>{connected ? 'Firestore Emulator tersambung' : 'Menunggu Firestore Emulator'}</strong>
          <p>Project {`demo-techlith-inventory-classroom`} · 127.0.0.1:8080 · tanpa koneksi production</p>
          {connectionError && <code className="connection-error">{connectionError}</code>}
        </div>
      </section>

      <div className="main-grid">
        <section className="panel transaction-panel" aria-labelledby="transaction-title">
          <div className="section-heading">
            <div><p className="eyebrow">MANUAL INTEGRATION TEST</p><h2 id="transaction-title">Form Stocktaking</h2></div>
          </div>
          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="item-select">Item</label>
            <select id="item-select" value={selectedItemId} onChange={(event) => setSelectedItemId(event.target.value)} disabled={!items.length}>
              {items.map((item) => <option key={item.id} value={item.id}>{item.id} · {item.name}</option>)}
            </select>
            <div className="current-stock"><span>Stock saat ini</span><strong>{selectedItem ? `${selectedItem.amount} ${selectedItem.unit}` : '—'}</strong></div>

            <div className="field-row">
              <div>
                <label className="field-label" htmlFor="transaction-type">Tipe transaksi</label>
                <select id="transaction-type" value={type} onChange={(event) => setType(event.target.value as TransactionType)}>
                  <option value="inbound">Inbound</option><option value="outbound">Outbound</option>
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="amount">Amount</label>
                <input id="amount" type="number" min="0.01" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} required />
              </div>
            </div>

            <label className="field-label" htmlFor="flow">Implementation</label>
            <select id="flow" value={flow} onChange={(event) => setFlow(event.target.value as FlowName)}>
              <option value="baseline">Baseline</option><option value="safe">Reference Safe Flow</option>
            </select>

            <label className="field-label" htmlFor="failure-mode">Failure injection</label>
            <select id="failure-mode" value={failureMode} onChange={(event) => setFailureMode(event.target.value as FailureMode)}>
              <option value="normal">Normal</option>
              <option value="stocktaking-write">stocktaking-write</option>
              <option value="item-update">item-update</option>
            </select>
            <p className="field-hint">Injeksi menolak write pada batas yang dipilih. Write lain dan rollback tetap memakai Firestore Emulator.</p>

            <button className="primary-button" type="submit" disabled={!connected || submitting || !selectedItem}>
              {submitting ? 'Menjalankan…' : 'Jalankan transaksi'}
            </button>
          </form>
          <div className="reset-note"><strong>Reset dataset</strong><span>Jalankan <code>npm run seed</code> di terminal classroom untuk memulihkan baseline. Reset tidak berjalan otomatis.</span></div>
        </section>

        <section className="panel messages-panel" aria-labelledby="messages-title">
          <div className="section-heading"><div><p className="eyebrow">RUNTIME</p><h2 id="messages-title">Pesan aplikasi</h2></div></div>
          {messages.length === 0
            ? <p className="empty-state">Pesan dari eksekusi transaksi akan muncul di sini.</p>
            : <ul className="message-list" aria-live="polite">{messages.map((message) => (
              <li className={`runtime-message ${message.kind}`} key={message.id}>
                <time>{message.createdAt}</time><span>{message.text}</span>
              </li>
            ))}</ul>}
        </section>
      </div>

      <section className="panel data-panel" aria-labelledby="data-title">
        <div className="section-heading"><div><p className="eyebrow">FIRESTORE EMULATOR · DATA AKTUAL</p><h2 id="data-title">Data inspector</h2></div></div>
        <h3>Collection: items</h3>
        <div className="table-wrap"><table><thead><tr><th>Kode Barang</th><th>Nama</th><th>Current stock</th><th>Referensi Kode Transaksi</th></tr></thead>
          <tbody>{items.map((item) => <tr key={item.id}><td><code>{item.id}</code></td><td>{item.name}</td><td>{item.amount} {item.unit}</td>
            <td>{item.stocktakingHistory?.length ? item.stocktakingHistory.map((id) => <code className="reference-chip" key={id}>{id}</code>) : <span className="muted">Kosong</span>}</td></tr>)}
            {!items.length && <tr><td colSpan={4} className="muted">Belum ada dokumen items yang terbaca.</td></tr>}
          </tbody></table></div>
        <h3>Collection: stocktakings</h3>
        <StocktakingTable records={sortedStocktakings} />
      </section>

      <section className="panel report-panel" aria-labelledby="report-title">
        <div className="section-heading"><div><p className="eyebrow">READ-ONLY COLLECTION VIEW</p><h2 id="report-title">Transaction report</h2></div></div>
        <div className="report-columns">
          <div><h3>Inbound <span>{inbound.length}</span></h3><StocktakingTable records={inbound} /></div>
          <div><h3>Outbound <span>{outbound.length}</span></h3><StocktakingTable records={outbound} /></div>
        </div>
        <p className="report-note">Report membaca dokumen aktual dari collection stocktakings. Tidak ada transaksi yang dibuat dari data form saja.</p>
      </section>

      <footer className="safety-footer">
        <strong>Classroom emulator only</strong>
        <span>Jangan hubungkan build ini ke Firebase production dan jangan deploy firestore.rules.</span>
      </footer>
    </main>
  )
}

function StocktakingTable({ records }: { records: StoredStocktaking[] }) {
  return <div className="table-wrap"><table><thead><tr><th>Kode Transaksi</th><th>Barang</th><th>Tipe</th><th>Jumlah</th><th>Sebelum</th><th>Sesudah</th><th>Waktu Dibuat</th></tr></thead>
    <tbody>{records.map((record) => <tr key={record.id}>
      <td><code>{record.id}</code></td><td><code>{record.itemId}</code></td><td>{record.type}</td><td>{record.amount}</td>
      <td>{record.prevAmount}</td><td>{record.nextAmount}</td><td>{record.dateCreated?.toDate().toLocaleString('id-ID') ?? '—'}</td>
    </tr>)}
      {!records.length && <tr><td colSpan={7} className="muted">Tidak ada dokumen yang terbaca.</td></tr>}
    </tbody></table></div>
}
