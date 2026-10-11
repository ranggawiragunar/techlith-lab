import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { DEMO_PROJECT_ID, db, EMULATOR_HOST, EMULATOR_PORT } from '../firebase/client'
import { executeStocktaking } from '../services/stocktaking'
import { validateInventoryConsistency } from '../domain/inventoryRules.mjs'
import { type FailureMode, type ItemRecord, type StocktakingRecord, type TransactionType } from '../types'

interface RuntimeMessage {
  id: string
  kind: 'success' | 'error'
  text: string
  time: string
}

type ConnectionState = 'connecting' | 'connected' | 'disconnected'

const HEALTH_CHECK_INTERVAL_MS = 3_000
const HEALTH_CHECK_TIMEOUT_MS = 1_500

const smokeCases = [
  ['FSMK-01', 'Buka aplikasi dan periksa koneksi lokal tanpa error fatal.'],
  ['FSMK-02', 'Pastikan tiga item baseline tampil dengan amountType dan history kosong.'],
  ['FSMK-03', 'Inbound 1 pada ITM-001; cocokkan stok 10 → 11 dan satu record.'],
  ['FSMK-04', 'Lanjutkan outbound 1; cocokkan stok 11 → 10 dan dua record berurutan.'],
  ['FSMK-05', 'Bandingkan dokumen item, stocktakings, dan history pada inspector.'],
]

const regressionCases = [
  ['REG-F-01', 'Kirim outbound 0; aplikasi menolak dan state tetap.'],
  ['REG-F-02', 'Dari baseline, outbound 10; stok menjadi 0 dan satu record konsisten.'],
  ['REG-F-03', 'Dari baseline, outbound 11; aplikasi menolak tanpa perubahan data.'],
  ['REG-F-04', 'Dari baseline, inbound 5; stok menjadi 15 dan satu record konsisten.'],
  ['REG-F-05', 'Inbound 5 lalu outbound 3; stok 12, dua record dan history berurutan.'],
  ['REG-F-06', 'Jalankan automated product validation; tinjau hasil regression command.'],
  ['REG-F-07', 'Jalankan transaksi normal serta kedua failure injection; cocokkan Firestore.'],
]

export function App() {
  const [items, setItems] = useState<ItemRecord[]>([])
  const [stocktakings, setStocktakings] = useState<StocktakingRecord[]>([])
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')
  const [connectionError, setConnectionError] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('ITM-001')
  const [type, setType] = useState<TransactionType>('inbound')
  const [amount, setAmount] = useState('1')
  const [failureMode, setFailureMode] = useState<FailureMode>('none')
  const [messages, setMessages] = useState<RuntimeMessage[]>([])
  const [submitting, setSubmitting] = useState(false)
  const connected = connectionState === 'connected'

  useEffect(() => {
    let disposed = false
    let emulatorReachable = false
    let hasCompletedHealthCheck = false
    let itemsServerBacked = false
    let stocktakingsServerBacked = false
    let listenersAttached = false
    let stopItems: (() => void) | undefined
    let stopStocktakings: (() => void) | undefined
    let healthTimer: ReturnType<typeof setTimeout> | undefined
    let requestTimeout: ReturnType<typeof setTimeout> | undefined
    let healthController: AbortController | undefined

    function updateConnectionState() {
      if (disposed) return
      if (!hasCompletedHealthCheck) {
        setConnectionState('connecting')
      } else if (!emulatorReachable) {
        setConnectionState('disconnected')
      } else if (itemsServerBacked && stocktakingsServerBacked) {
        setConnectionState('connected')
      } else {
        setConnectionState('connecting')
      }
    }

    function stopListeners() {
      stopItems?.()
      stopStocktakings?.()
      stopItems = undefined
      stopStocktakings = undefined
      listenersAttached = false
    }

    function attachListeners() {
      if (disposed || listenersAttached) return
      listenersAttached = true
      stopItems = onSnapshot(collection(db, 'items'), { includeMetadataChanges: true }, (snapshot) => {
        itemsServerBacked = !snapshot.metadata.fromCache
        setItems(snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }) as ItemRecord))
        updateConnectionState()
      }, (error) => {
        itemsServerBacked = false
        stocktakingsServerBacked = false
        emulatorReachable = false
        hasCompletedHealthCheck = true
        setConnectionError(`Listener items tidak tersedia: ${error.message}`)
        updateConnectionState()
        stopListeners()
      })

      stopStocktakings = onSnapshot(collection(db, 'stocktakings'), { includeMetadataChanges: true }, (snapshot) => {
        stocktakingsServerBacked = !snapshot.metadata.fromCache
        setStocktakings(snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }) as StocktakingRecord))
        updateConnectionState()
      }, (error) => {
        itemsServerBacked = false
        stocktakingsServerBacked = false
        emulatorReachable = false
        hasCompletedHealthCheck = true
        setConnectionError(`Listener stocktakings tidak tersedia: ${error.message}`)
        updateConnectionState()
        stopListeners()
      })
    }

    async function verifyEmulator() {
      const healthUrl = `http://${EMULATOR_HOST}:${EMULATOR_PORT}/v1/projects/${DEMO_PROJECT_ID}/databases/(default)/documents/items/ITM-001`
      healthController = new AbortController()
      requestTimeout = setTimeout(() => healthController?.abort(), HEALTH_CHECK_TIMEOUT_MS)

      try {
        const response = await fetch(healthUrl, {
          method: 'GET',
          cache: 'no-store',
          signal: healthController.signal,
        })
        if (!response.ok) throw new Error(`Health check HTTP ${response.status}`)

        emulatorReachable = true
        hasCompletedHealthCheck = true
        setConnectionError('')
        attachListeners()
      } catch {
        emulatorReachable = false
        hasCompletedHealthCheck = true
        itemsServerBacked = false
        stocktakingsServerBacked = false
        setConnectionError('Firestore Emulator lokal tidak merespons. Data yang masih terlihat adalah cache terakhir dan belum terverifikasi.')
        stopListeners()
      } finally {
        if (requestTimeout) clearTimeout(requestTimeout)
        healthController = undefined
        requestTimeout = undefined
        updateConnectionState()
        if (!disposed) healthTimer = setTimeout(verifyEmulator, HEALTH_CHECK_INTERVAL_MS)
      }
    }

    void verifyEmulator()

    return () => {
      disposed = true
      if (healthTimer) clearTimeout(healthTimer)
      if (requestTimeout) clearTimeout(requestTimeout)
      healthController?.abort()
      stopListeners()
    }
  }, [])

  const selectedItem = items.find((item) => item.id === selectedItemId)
  const sortedStocktakings = useMemo(
    () => [...stocktakings].sort((left, right) => (right.dateCreated?.toMillis?.() ?? 0) - (left.dateCreated?.toMillis?.() ?? 0)),
    [stocktakings],
  )
  const consistency = useMemo(() => validateInventoryConsistency(items, stocktakings), [items, stocktakings])

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
            <p className="eyebrow">SESSION 7 CLASSROOM BUILD · FINAL RELEASE</p>
            <p className="brand-name">Techlith Inventory Core</p>
          </div>
        </div>
        <div className="hero-copy">
          <div>
            <p className="eyebrow">FINAL RELEASE CLASSROOM BUILD</p>
            <h1>Automated Regression Lab</h1>
            <p className="lede">Jalankan regression otomatis dan skenario manual, lalu cocokkan pesan dengan dokumen aktual Firestore Emulator.</p>
          </div>
          <a className="emulator-link" href="http://127.0.0.1:4000" target="_blank" rel="noreferrer">Buka Firestore Emulator UI <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className={`connection-card is-${connectionState}`} role="status" aria-live="polite">
        <span className="connection-dot" aria-hidden="true" />
        <div>
          <strong>{connected ? 'Terhubung ke Firestore Emulator lokal' : connectionState === 'disconnected' ? 'Firestore Emulator lokal tidak tersedia' : 'Memverifikasi koneksi Firestore Emulator'}</strong>
          <p>Project <code>demo-techlith-inventory-session-7</code> · <code>127.0.0.1:8080</code> · tanpa koneksi production</p>
          {!connected && <p className="connection-error">{connectionError || 'Data yang terlihat belum dikonfirmasi dari server dan dapat berasal dari cache.'}</p>}
        </div>
        <span className="connection-label">{connected ? 'EMULATOR AKTIF' : connectionState === 'disconnected' ? 'KONEKSI TERPUTUS' : 'MEMVERIFIKASI'}</span>
      </section>

      <div className="workspace-grid">
        <section className="panel transaction-panel" aria-labelledby="transaction-title">
          <div className="panel-heading">
            <div><p className="eyebrow">SAFE TRANSACTION FLOW</p><h2 id="transaction-title">Catat pergerakan stok</h2></div>
            <span className="safe-badge">Atomic · runTransaction</span>
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
                <input id="amount" type="number" step="any" inputMode="decimal" required value={amount} onChange={(event) => setAmount(event.target.value)} />
              </div>
            </div>

            <label htmlFor="failure-mode">Failure injection · untuk REG-F-07</label>
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
          <div><p className="eyebrow">FIRESTORE EMULATOR · {connected ? 'DATA TERKINI' : 'DATA CACHE / BELUM TERVERIFIKASI'}</p><h2 id="inspector-title">Data Inspector</h2></div>
          <span className="read-only-label">TAMPILAN READ-ONLY</span>
        </div>

        <div className={`consistency-banner ${!connected ? 'is-waiting' : consistency.valid ? 'is-consistent' : 'has-inconsistency'}`} role="status" aria-live="polite">
          <strong>{!connected ? connectionState === 'disconnected' ? 'Data cache terakhir — koneksi server belum tersedia' : 'Memverifikasi data terbaru dari emulator' : consistency.valid ? 'Data server-backed yang diamati konsisten' : 'Ada ketidaksesuaian pada data yang diamati'}</strong>
          <span>{!connected ? 'Nilai yang masih terlihat dapat berasal dari cache lokal. Pemeriksaan aritmetika tidak mengonfirmasi bahwa data ini terbaru.' : 'Indikator pemeriksaan referensi dan aritmetika record; ini bukan verdict PASS/FAIL untuk mahasiswa.'}</span>
          {connected && !consistency.valid && <ul>{consistency.errors.map((error, index) => <li key={`${index}-${error}`}>{error}</li>)}</ul>}
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
            <thead><tr><th scope="col">Kode Transaksi</th><th scope="col">Kode Barang</th><th scope="col">Tipe</th><th scope="col">Jumlah</th><th scope="col">Sebelum</th><th scope="col">Sesudah</th><th scope="col">Waktu dibuat</th><th scope="col">Konsistensi record</th></tr></thead>
            <tbody>{sortedStocktakings.map((record) => <tr key={record.id}>
              <td><code>{record.id}</code></td><td><code>{record.itemId}</code></td><td><span className={`type-pill ${record.type}`}>{record.type}</span></td>
              <td className="numeric-cell">{record.amount}</td><td className="numeric-cell">{record.prevAmount}</td><td className="numeric-cell">{record.nextAmount}</td>
              <td>{typeof record.dateCreated?.toDate === 'function' ? record.dateCreated.toDate().toLocaleString('id-ID') : '—'}</td>
              <td><span className={`record-consistency ${consistency.recordResults[record.id] === false ? 'is-invalid' : 'is-valid'}`}>{consistency.recordResults[record.id] === false ? 'Perlu diperiksa' : 'Konsisten'}</span></td>
            </tr>)}
            {!stocktakings.length && <tr><td colSpan={8} className="table-empty">Belum ada dokumen stocktakings.</td></tr>}
            </tbody>
          </table></div>
        </div>
        <p className="inspector-footnote">Data mengikuti listener Firestore Emulator lokal. History references tersimpan pada tiap dokumen item.</p>
      </section>

      <div className="guides-grid">
        <section className="panel guide-panel" aria-labelledby="smoke-title">
          <div className="panel-heading"><div><p className="eyebrow">GATE SEBELUM REGRESSION</p><h2 id="smoke-title">Final smoke test</h2></div><span className="neutral-pill">Catat hasil sendiri</span></div>
          <ol className="scenario-list">{smokeCases.map(([id, instruction]) => <li key={id}><code>{id}</code><span>{instruction}</span></li>)}</ol>
        </section>
        <section className="panel guide-panel" aria-labelledby="regression-title">
          <div className="panel-heading"><div><p className="eyebrow">RELEASE REGRESSION</p><h2 id="regression-title">Manual regression</h2></div><span className="neutral-pill">Tanpa penilaian otomatis</span></div>
          <ol className="scenario-list">{regressionCases.map(([id, instruction]) => <li key={id}><code>{id}</code><span>{instruction}</span></li>)}</ol>
        </section>
      </div>

      <footer className="safety-footer">
        <div><strong>Classroom emulator only</strong><span>Final Release untuk praktikum lokal, bukan aplikasi production.</span></div>
        <span>Tanpa Firebase production · tanpa credential · jangan expose ke jaringan publik</span>
      </footer>
    </main>
  )
}
