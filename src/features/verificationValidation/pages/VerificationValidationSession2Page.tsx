import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '../../../components/ConfirmDialog'
import { prepareSession2Baseline } from '../services/prepareSession2Baseline'
import { Session2Worksheet } from '../components/Session2Worksheet'
import { verificationValidationRoutes } from '../routes'

const requirements = [
  ['REQ-INV-001', 'Stock Outbound quantity must be greater than 0.'],
  ['REQ-INV-002', 'Stock Outbound quantity must not exceed current stock; exact-stock is valid and results in next stock = 0.'],
  ['REQ-INV-003', 'Whole-number units such as pcs / unit accept integer quantities only.'],
  ['REQ-INV-004', 'Fractional units such as meter may accept fractional quantity with a maximum precision of 3 decimal places.'],
  ['REQ-INV-005', 'Archived items must not accept new movements; existing history remains available.'],
  ['REQ-INV-006', 'Successful movement history must preserve consistent prevAmount, amount, and nextAmount values.'],
] as const

export function VerificationValidationSession2Page() {
  const [confirming, setConfirming] = useState(false)
  const [preparing, setPreparing] = useState(false)
  const [baselineMessage, setBaselineMessage] = useState('')

  async function handlePrepareBaseline() {
    setPreparing(true)
    setBaselineMessage('')
    try {
      await prepareSession2Baseline()
      setBaselineMessage('Baseline siap: BRG-005 menggunakan unit pcs dengan current stock 10; movement history kosong.')
      setConfirming(false)
    } catch {
      setBaselineMessage('Baseline belum dapat disiapkan. Periksa kembali data lokal atau minta bantuan fasilitator.')
    } finally {
      setPreparing(false)
    }
  }

  return (
    <section className="s2-page" aria-labelledby="session2-title">
      <Link className="back-link" to={verificationValidationRoutes.basePath}>← Kembali ke course roadmap</Link>
      <header className="content-card s2-hero">
        <div className="s2-hero-copy">
          <div className="eyebrow">SESSION 2 · MINI CASE</div>
          <h1 id="session2-title">Merancang Test Berbasis Objective, Experience, dan Input Domain pada Techlith Lab Inventory</h1>
          <p>Ubah analisis awal menjadi rancangan pengujian yang memiliki data, technique, dan expected result yang dapat ditelusuri.</p>
        </div>
        <div className="s2-hero-facts"><span><strong>Delivery</strong>Mini Case</span><span><strong>Durasi</strong>± 30 menit</span></div>
        <div className="s2-hero-output"><strong>Output</strong><span>Requirement-to-technique mapping, rancangan EP/BVA, ide experience-based, dan enam candidate test case.</span></div>
      </header>

      <section className="content-card s2-panel">
        <div className="s2-section-head"><div><div className="eyebrow">CARRY-FORWARD · SESSION 1</div><h2>Dari sasaran ke rancangan test</h2></div></div>
        <p>Anda telah memilih testing focus/evidence, menghubungkannya dengan requirement, menyusun objective, memilih primary test level, mencatat evidence lanjutan, dan menentukan prioritas. Session 2 mengubah reasoning tersebut menjadi candidate test design yang konkret.</p>
      </section>

      <section className="content-card s2-panel">
        <div className="s2-section-head"><div><div className="eyebrow">DESIGN SCOPE</div><h2>Area inventori untuk dirancang pengujiannya</h2></div></div>
        <ul className="s2-scope-list">
          <li>Outbound quantity lebih besar dari 0.</li>
          <li>Outbound quantity tidak melebihi current stock.</li>
          <li>Boundary exact-stock menghasilkan next stock 0.</li>
          <li>Unit whole-number dan fractional menggunakan domain quantity berbeda.</li>
          <li>Precision quantity fractional maksimal 3 desimal.</li>
          <li>State active dan archived membatasi movement baru.</li>
          <li>Stock History konsisten dengan perubahan stock.</li>
          <li>Sequence inbound/outbound berulang sebelum history diperiksa.</li>
        </ul>
      </section>

      <section className="content-card s2-panel">
        <div className="s2-section-head"><div><div className="eyebrow">OBSERVATIONS &amp; RISK CUES</div><h2>Petunjuk untuk eksplorasi</h2></div></div>
        <div className="s2-cues-grid">
          <article><span>Observation</span><p>Session 1 mencatat BRG-001 dengan stock 10 pernah diproses outbound 11 dan menampilkan stock -1.</p></article>
          <article><span>Usage risk</span><p>Pengguna dapat melakukan beberapa aksi inbound/outbound sebelum membuka Stock History.</p></article>
          <article><span>Input domain</span><p>Unit pcs dan meter digunakan pada item yang sama-sama aktif, dengan bentuk quantity berbeda.</p></article>
        </div>
        <p className="s2-reminder">Perlakukan ini sebagai observation atau risk cue. Tentukan expected result dari requirement, lalu catat evidence yang akan dikumpulkan.</p>
      </section>

      <section className="content-card s2-panel s2-requirements">
        <div className="s2-section-head"><div><div className="eyebrow">REQUIREMENT PACK</div><h2>Requirement untuk rancangan</h2></div><span className="session-count">6 requirements</span></div>
        <div className="session-reference-list">
          {requirements.map(([id, description]) => <article className="session-reference" key={id}><code>{id}</code><p>{description}</p></article>)}
        </div>
      </section>

      <section className="content-card s2-panel">
        <div className="s2-section-head"><div><div className="eyebrow">SUT SHORTCUTS &amp; CLASSROOM BASELINE</div><h2>Siapkan area eksplorasi</h2></div></div>
        <p>Baseline Session 2 adalah kondisi kelas deterministik. Menyiapkannya mengembalikan data lokal ke seed awal, menghapus perubahan inventory dan movement history lokal, lalu mengatur BRG-005 ke stock 10. Sesi admin tetap aktif. Aksi ini hanya untuk persiapan kelas, bukan perilaku normal inventory.</p>
        <div className="s2-baseline-action">
          <div><strong>Boundary item: BRG-005</strong><span>Unit pcs · current stock 10 setelah persiapan</span></div>
          <button className="button button-primary" type="button" onClick={() => setConfirming(true)} disabled={preparing}>{preparing ? 'Preparing…' : 'Prepare Session 2 baseline'}</button>
        </div>
        {baselineMessage && <div className="success-message s2-baseline-message" role="status">{baselineMessage}</div>}
        <div className="s2-shortcuts">
          <Link className="session-shortcut" to="/admin/inventory/items/BRG-005"><span>Whole-number boundary</span><strong>BRG-005 · pcs →</strong></Link>
          <Link className="session-shortcut" to="/admin/inventory/items/BRG-001"><span>Fractional / precision</span><strong>BRG-001 · meter →</strong></Link>
          <Link className="session-shortcut" to="/admin/inventory/history"><span>Movement consistency</span><strong>Stock History →</strong></Link>
          <Link className="session-shortcut" to="/admin/testing"><span>Testing Utilities</span><strong>Local data tools →</strong></Link>
        </div>
      </section>

      <section className="content-card s2-panel s2-carry">
        <div className="s2-section-head"><div><div className="eyebrow">TASK 2 · EP &amp; BVA</div><h2>Rancang input domain BRG-005</h2></div></div>
        <p>Dengan unit pcs dan stock 10, turunkan equivalence partition yang valid/invalid serta boundary di sekitar batas quantity positif dan current stock. Klasifikasikan setiap candidate value sendiri.</p>
        <div className="s2-value-chips" aria-label="Candidate values untuk diklasifikasikan"><span>0</span><span>1</span><span>2</span><span>9</span><span>10</span><span>11</span></div>
        <p>Tambahkan setidaknya satu input fractional untuk domain pcs. Pertimbangkan pula bagaimana nilai dan precision fractional-unit seperti meter dibedakan.</p>
        <p className="s2-expected-note">Untuk over-stock, expected result mengikuti REQ-INV-002. Observation perilaku saat ini adalah evidence untuk dianalisis, bukan expected result.</p>
      </section>

      <section className="content-card s2-panel s2-short-carry">
        <div className="s2-section-head"><div><div className="eyebrow">OUTPUT · CARRY-FORWARD TO SESSION 3</div><h2>Hasil rancangan yang perlu dibawa</h2></div></div>
        <ul className="s2-scope-list">
          <li>Mapping requirement → objective → technique.</li>
          <li>EP/BVA reasoning dan klasifikasi input domain.</li>
          <li>Sedikitnya tiga experience-based testing ideas.</li>
          <li>Enam candidate test cases dengan expected result berdasarkan requirement.</li>
        </ul>
      </section>

      <Session2Worksheet />

      {confirming && <ConfirmDialog title="Prepare Session 2 baseline?" description="This resets local inventory changes and movement history to the normal seed baseline, then sets BRG-005 (pcs) to stock 10. Your seeded administrator identity and current login are preserved." confirmLabel={preparing ? 'Preparing…' : 'Prepare baseline'} busy={preparing} onCancel={() => setConfirming(false)} onConfirm={() => void handlePrepareBaseline()} />}
    </section>
  )
}
