import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/client'
import { executeStocktaking } from '../services/stocktaking'
import { type FailureMode, type ItemRecord, type StocktakingRecord, type TransactionType } from '../types'

interface RuntimeMessage {
  id: string
  kind: 'success' | 'error'
  text: string
  time: string
}

const smokeCases = [
  ['SMK-01', 'Buka aplikasi tanpa error fatal.'],
  ['SMK-02', 'Pastikan tiga item baseline tampil.'],
  ['SMK-03', 'Inbound 1 pada ITM-001; periksa stok 10 → 11.'],
  ['SMK-04', 'Lanjutkan outbound 1; periksa stok 11 → 10.'],
  ['SMK-05', 'Bandingkan item, stocktakings, dan history di inspector.'],
]

const acceptanceCases = [
  ['ACC-01', 'Periksa ITM-001, jumlah 10 meter, dan history kosong.'],
  ['ACC-02', 'Inbound 5 dari baseline 10; verifikasi jumlah 15 dan record.'],
  ['ACC-03', 'Reset seed, lalu outbound 10; verifikasi jumlah akhir 0.'],
  ['ACC-04', 'Reset seed, lalu outbound 11; verifikasi tidak ada perubahan.'],
  ['ACC-05', 'Uji dua mode failure injection dan periksa state Firestore.'],
]

export function App() {
  const [items, setItems] = useState<ItemRecord[]>([])
  const [stocktakings, setStocktakings] = useState<StocktakingRecord[]>([])
  const [connected, setConnected] = useState(false)
  const [connectionError, setConnectionError] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('ITM-001')
  const [type, setType] = useState<TransactionType>('inbound')
  const [amount, setAmount] = useState('1')
  const [failureMode, setFailureMode] = useState<FailureMode>('none')
  const [messages, setMessages] = useState<RuntimeMessage[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let receivedItems = false
    let receivedStocktakings = false

    const stopItems = onSnapshot(collection(db, 'items'), (snapshot) => {
      receivedItems = true
      setItems(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as ItemRecord))
      if (receivedItems && receivedStocktakings) {
        setConnected(true)
        setConnectionError('')
      }
    }, (error) => {
      setConnected(false)
      setConnectionError(error.message)
    })

    const stopStocktakings = onSnapshot(collection(db, 'stocktakings'), (snapshot) => {
      receivedStocktakings = true
      setStocktakings(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as StocktakingRecord))
      if (receivedItems && receivedStocktakings) {
        setConnected(true)
        setConnectionError('')
      }
    }, (error) => {
      setConnected(false)
      setConnectionError(error.message)
    })

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

  function addMessage(kind: RuntimeMessage['kind'], text: string) {
    setMessages((current) => [{
      id: crypto.randomUUID(),
      kind,
      text,
      time: new Date().toLocaleTimeString('id-ID'),
    }, ...current])
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!connected || !selectedItem) {
      addMessage('error', 'Emulator belum tersambung atau item belum tersedia. Tidak ada transaksi yang dijalankan.')
      return
    }

    setSubmitting(true)
    try {
      const result = await executeStocktaking({
        itemId: selectedItemId,
        type,
        amount: Number(amount),
        failureMode,
      })
      addMessage('success', `Transaksi ${result.type} berhasil disimpan. Stok ${result.prevAmount} → ${result.nextAmount}; Kode Transaksi ${result.transactionId}.`)
    } catch (error) {
      addMessage('error', error instanceof Error ? error.message : String(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">LF</div>
          <div>
            <p className="eyebrow">SESSION 6 CLASSROOM BUILD · RC-1</p>
            <p className="brand-name">Techlith Inventory Core</p>
          </div>
        </div>
        <div className="hero-copy">
          <div>
            <p className="eyebrow">RELEASE CANDIDATE RC-1</p>
            <h1>System Acceptance Lab</h1>
            <p className="lede">Jalankan skenario secara manual, lalu cocokkan pesan aplikasi dengan data aktual Firestore Emulator.</p>
          </div>
          <a className="emulator-link" href="http://127.0.0.1:4000" target="_blank" rel="noreferrer">Buka Firestore Emulator UI <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className={`connection-card ${connected ? 'is-connected' : 'is-waiting'}`} role="status" aria-live="polite">
        <span className="connection-dot" aria-hidden="true" />
        <div>
          <strong>{connected ? 'Terhubung ke Firestore Emulator lokal' : 'Menunggu Firestore Emulator'}</strong>
          <p>Project <code>demo-techlith-inventory-session-6</code> · <code>127.0.0.1:8080</code> · tanpa koneksi production</p>
          {connectionError && <p className="connection-error">{connectionError}</p>}
        </div>
        <span className="connection-label">{connected ? 'EMULATOR AKTIF' : 'BELUM TERHUBUNG'}</span>
      </section>

      <div className="workspace-grid">
        <section className="panel transaction-panel" aria-labelledby="transaction-title">
          <div className="panel-heading">
            <div><p className="eyebrow">SAFE TRANSACTION FLOW</p><h2 id="transaction-title">Catat pergerakan stok</h2></div>
            <span className="safe-badge">Atomik</span>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="item-select">Barang</label>
            <select id="item-select" value={selectedItemId} onChange={(event) => setSelectedItemId(event.target.value)} disabled={!items.length}>
              {items.map((item) => <option key={item.id} value={item.id}>{item.id} · {item.name}</option>)}
            </select>

            <div className="stock-summary">
              <span>Stok saat ini</span>
              <strong>{selectedItem ? `${selectedItem.amount} ${selectedItem.amountType}` : 'Belum tersedia'}</strong>
            </div>

            <div className="form-row">
              <div>
                <label htmlFor="transaction-type">Tipe transaksi</label>
                <select id="transaction-type" value={type} onChange={(event) => setType(event.target.value as TransactionType)}>
                  <option value="inbound">Inbound · barang masuk</option>
                  <option value="outbound">Outbound · barang keluar</option>
                </select>
              </div>
              <div>
                <label htmlFor="amount">Jumlah</label>
                <input id="amount" type="number" min="1" step="1" inputMode="numeric" required value={amount} onChange={(event) => setAmount(event.target.value)} />
              </div>
            </div>

            <label htmlFor="failure-mode">Failure injection · untuk ACC-05</label>
            <select id="failure-mode" value={failureMode} onChange={(event) => setFailureMode(event.target.value as FailureMode)}>
              <option value="none">Tidak ada · transaksi normal</option>
              <option value="stocktaking-write">stocktaking-write</option>
              <option value="item-update">item-update</option>
            </select>
            <p className="field-help">Kegagalan terkontrol membatalkan transaksi sebelum commit. Catat hasil aktual; periksa data di inspector.</p>

            <button className="submit-button" type="submit" disabled={!connected || submitting || !selectedItem}>
              {submitting ? <><span className="spinner" aria-hidden="true" /> Memproses transaksi…</> : 'Jalankan transaksi'}
            </button>
          </form>
          <div className="reset-hint"><strong>Perlu baseline baru?</strong><span>Jalankan <code>npm run seed</code> di terminal. Data tidak di-reset otomatis.</span></div>
        </section>

        <section className="panel runtime-panel" aria-labelledby="runtime-title">
          <div className="panel-heading">
            <div><p className="eyebrow">HASIL OPERASI</p><h2 id="runtime-title">Pesan runtime</h2></div>
            <span className="count-pill">{messages.length} pesan</span>
          </div>
          {messages.length === 0
            ? <div className="empty-state"><span className="empty-icon" aria-hidden="true">↳</span><p>Pesan transaksi akan tampil di sini. Periksa Firestore sebelum menyimpulkan hasil.</p></div>
            : <ul className="message-list" aria-live="polite">{messages.map((message) => (
              <li className={`runtime-message ${message.kind}`} key={message.id}>
                <span className="message-icon" aria-hidden="true">{message.kind === 'success' ? '✓' : '!'}</span>
                <div><time>{message.time}</time><p>{message.text}</p></div>
              </li>
            ))}</ul>}
          <div className="manual-decision-note"><strong>Pesan bukan bukti tunggal.</strong><span>Validasi jumlah dan referensi pada Data Inspector serta Emulator UI.</span></div>
        </section>
      </div>

      <section className="panel inspector-panel" aria-labelledby="inspector-title">
        <div className="panel-heading inspector-heading">
          <div><p className="eyebrow">FIRESTORE EMULATOR · DATA AKTUAL</p><h2 id="inspector-title">Data Inspector</h2></div>
          <span className="read-only-label">TAMPILAN READ-ONLY</span>
        </div>

        <div className="data-section">
          <div className="data-title-row"><h3>Collection: items</h3><span>{items.length} dokumen</span></div>
          <div className="table-scroll"><table>
            <thead><tr><th scope="col">Kode Barang</th><th scope="col">Nama barang</th><th scope="col">Stok saat ini</th><th scope="col">Amount type</th><th scope="col">History references</th></tr></thead>
            <tbody>{items.map((item) => <tr key={item.id}>
              <td><code>{item.id}</code></td><td>{item.name}</td><td className="numeric-cell">{item.amount}</td><td>{item.amountType}</td>
              <td>{item.stocktakingHistory?.length
                ? <div className="reference-list">{item.stocktakingHistory.map((reference) => <code key={reference}>{reference}</code>)}</div>
                : <span className="empty-value">Kosong</span>}</td>
            </tr>)}
            {!items.length && <tr><td colSpan={5} className="table-empty">Belum ada dokumen items yang terbaca.</td></tr>}
            </tbody>
          </table></div>
        </div>

        <div className="data-section">
          <div className="data-title-row"><h3>Collection: stocktakings</h3><span>{stocktakings.length} dokumen</span></div>
          <div className="table-scroll"><table className="transactions-table">
            <thead><tr><th scope="col">Kode Transaksi</th><th scope="col">Kode Barang</th><th scope="col">Tipe</th><th scope="col">Jumlah</th><th scope="col">Sebelum</th><th scope="col">Sesudah</th><th scope="col">Waktu dibuat</th></tr></thead>
            <tbody>{sortedStocktakings.map((record) => <tr key={record.id}>
              <td><code>{record.id}</code></td><td><code>{record.itemId}</code></td><td><span className={`type-pill ${record.type}`}>{record.type}</span></td>
              <td className="numeric-cell">{record.amount}</td><td className="numeric-cell">{record.prevAmount}</td><td className="numeric-cell">{record.nextAmount}</td>
              <td>{record.dateCreated?.toDate().toLocaleString('id-ID') ?? '—'}</td>
            </tr>)}
            {!stocktakings.length && <tr><td colSpan={7} className="table-empty">Belum ada dokumen stocktakings.</td></tr>}
            </tbody>
          </table></div>
        </div>
        <p className="inspector-footnote">Data ditampilkan dari listener Firestore Emulator aktif. History references tersimpan pada tiap dokumen item.</p>
      </section>

      <div className="guides-grid">
        <section className="panel guide-panel" aria-labelledby="smoke-title">
          <div className="panel-heading"><div><p className="eyebrow">CHECKLIST MANUAL</p><h2 id="smoke-title">Smoke test</h2></div><span className="neutral-pill">Catat hasil sendiri</span></div>
          <ol className="scenario-list">{smokeCases.map(([id, instruction]) => <li key={id}><code>{id}</code><span>{instruction}</span></li>)}</ol>
        </section>
        <section className="panel guide-panel" aria-labelledby="acceptance-title">
          <div className="panel-heading"><div><p className="eyebrow">CHECKLIST MANUAL</p><h2 id="acceptance-title">Acceptance scenarios</h2></div><span className="neutral-pill">Tanpa penilaian otomatis</span></div>
          <ol className="scenario-list">{acceptanceCases.map(([id, instruction]) => <li key={id}><code>{id}</code><span>{instruction}</span></li>)}</ol>
        </section>
      </div>

      <footer className="safety-footer">
        <div><strong>Classroom emulator only</strong><span>RC-1 adalah release candidate untuk praktikum lokal, bukan aplikasi production.</span></div>
        <span>Tanpa Firebase production · tanpa credential · jangan expose ke jaringan publik</span>
      </footer>
    </main>
  )
}
