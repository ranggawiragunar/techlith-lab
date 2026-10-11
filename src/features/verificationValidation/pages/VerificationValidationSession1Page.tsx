import { Link } from 'react-router-dom'
import { SessionWorksheet } from '../components/SessionWorksheet'
import { verificationValidationRoutes } from '../routes'

const requirements = [
  ['REQ-INV-001', 'Quantity Stock Outbound harus lebih besar dari 0.'],
  ['REQ-INV-002', 'Quantity Stock Outbound tidak boleh melebihi current stock; exact-stock valid dan menghasilkan next stock = 0.'],
  ['REQ-INV-003', 'Unit whole-number seperti pcs / unit hanya menerima quantity bilangan bulat.'],
  ['REQ-INV-004', 'Unit fractional seperti meter dapat menerima quantity pecahan dengan precision maksimal 3 desimal.'],
  ['REQ-INV-005', 'Archived item tidak menerima movement baru, tetapi movement history yang sudah ada tetap tersedia.'],
  ['REQ-INV-006', 'Movement sukses menyimpan prevAmount, amount, dan nextAmount secara konsisten pada Stock History.'],
] as const

const evidence = [
  ['EV-INV-001', 'BRG-001 memiliki stock 10. Outbound 11 diproses; current stock menjadi -1 dan history mencatat 10 / 11 / -1.'],
  ['EV-INV-002', 'Saat amount 0 dimasukkan, tombol Submit/Proses Outbound masih dapat ditekan. Setelah aksi submit, transaksi ditolak; stock dan history tidak berubah.'],
  ['EV-INV-003', 'BRG-001 memiliki stock 10. Outbound 10 berhasil; current stock menjadi 0 dan history mencatat 10 / 10 / 0.'],
  ['EV-INV-004', 'Item yang di-archive hilang dari daftar aktif, tetapi movement history lama tetap dapat dilihat.'],
  ['EV-INV-005', 'Testing Utilities mengembalikan seed baseline dan membersihkan movement lokal tanpa mengakhiri sesi admin.'],
] as const

export function VerificationValidationSession1Page() {
  return (
    <section className="session-page" aria-labelledby="session1-title">
      <Link className="back-link" to={verificationValidationRoutes.basePath}>← Kembali ke course roadmap</Link>
      <header className="session-hero content-card">
        <div className="session-hero-copy">
          <div className="eyebrow">SESSION 1 · MINI CASE</div>
          <h1 id="session1-title">Menentukan Sasaran dan Level Pengujian pada Techlith Lab Inventory</h1>
          <p>Gunakan observasi dan requirement untuk menyusun analisis pengujian awal yang dapat ditelusuri.</p>
        </div>
        <div className="session-facts"><span><strong>Delivery</strong>Mini Case</span><span><strong>Durasi</strong>± 30 menit</span></div>
        <div className="session-output"><strong>Output mahasiswa</strong><span>Fokus/evidence terpilih, requirement terkait, objective pengujian, level utama, evidence lanjutan, dan prioritas.</span></div>
      </header>

      <section className="session-panel content-card">
        <div className="session-section-heading"><div><div className="eyebrow">TARGET PEMBELAJARAN</div><h2>Setelah sesi ini, Anda dapat</h2></div></div>
        <ul className="session-targets">
          <li>Membedakan observation, requirement, dan conclusion.</li>
          <li>Menyusun testing objective yang dapat diverifikasi.</li>
          <li>Memilih Unit, Integration, atau System Testing sebagai level utama.</li>
          <li>Mengidentifikasi evidence yang masih diperlukan.</li>
          <li>Menentukan prioritas awal berdasarkan pertimbangan yang dijelaskan.</li>
        </ul>
      </section>

      <section className="session-panel content-card">
        <div className="session-section-heading"><div><div className="eyebrow">RUNNING CASE</div><h2>Techlith Lab — Inventory Management Laboratory</h2></div></div>
        <p>Techlith Lab adalah aplikasi inventori local-first. Pada sesi ini, Main Application digunakan sebagai System Under Test (SUT) dari sudut pandang pengguna.</p>
        <div className="session-boundary"><strong>Batas sesi:</strong> source code dan analisis root cause berada di luar scope. Perancangan test case secara terperinci dilanjutkan pada Session 2.</div>
        <h3 className="session-subheading">Buka area SUT</h3>
        <div className="session-shortcuts">
          <Link className="session-shortcut" to="/admin/inventory/items/BRG-001"><span>Item Detail</span><strong>BRG-001 →</strong></Link>
          <Link className="session-shortcut" to="/admin/inventory/history"><span>Stock History</span><strong>Lihat riwayat →</strong></Link>
          <Link className="session-shortcut" to="/admin/testing"><span>Testing Utilities</span><strong>Kelola baseline →</strong></Link>
        </div>
      </section>

      <section className="session-panel content-card">
        <div className="session-section-heading"><div><div className="eyebrow">REQUIREMENT PACK</div><h2>Requirement yang tersedia</h2></div><span className="session-count">6 requirements</span></div>
        <div className="session-reference-list">
          {requirements.map(([id, description]) => <article className="session-reference" key={id}><code>{id}</code><p>{description}</p></article>)}
        </div>
      </section>

      <section className="session-panel content-card">
        <div className="session-section-heading"><div><div className="eyebrow">EVIDENCE PACK</div><h2>Observasi awal</h2></div><span className="session-count">5 observations</span></div>
        <div className="session-reference-list">
          {evidence.map(([id, description]) => <article className="session-reference session-observation" key={id}><code>{id}</code><p>{description}</p></article>)}
        </div>
        <p className="session-reminder">Evidence awal tidak otomatis berarti defect. Bandingkan observation dengan requirement sebelum membuat conclusion.</p>
      </section>

      <section className="session-panel content-card">
        <div className="session-section-heading"><div><div className="eyebrow">TUGAS A · TESTING OBJECTIVES</div><h2>Rumuskan sasaran pengujian</h2></div></div>
        <p>Pilih sedikitnya tiga area fokus dari evidence atau penggunaan SUT. Untuk setiap area, tulis objective yang spesifik dan dapat diverifikasi.</p>
      </section>

      <section className="session-panel content-card">
        <div className="session-section-heading"><div><div className="eyebrow">TUGAS B · TEST LEVEL</div><h2>Petakan level pengujian</h2></div></div>
        <div className="session-level-grid">
          <article><h3>Unit Testing</h3><p>Aturan kecil seperti validasi quantity, boundary logic, atau perhitungan next stock.</p></article>
          <article><h3>Integration Testing</h3><p>Konsistensi perubahan service/data dan Stock History dalam satu workflow.</p></article>
          <article><h3>System Testing</h3><p>Alur pengguna Item Detail → Stock Outbound → current stock → Stock History.</p></article>
        </div>
        <p>Satu fokus dapat melibatkan beberapa level. Pilih satu level utama dan jelaskan level pendukung bila digunakan.</p>
      </section>

      <section className="session-panel content-card">
        <div className="session-section-heading"><div><div className="eyebrow">TUGAS C · PRIORITAS</div><h2>Tentukan prioritas awal</h2></div></div>
        <p>Pertimbangkan <strong>risk</strong>, <strong>frequency</strong>, dan <strong>detectability</strong>. Catat alasan singkat untuk setiap pilihan.</p>
      </section>

      <SessionWorksheet />

      <section className="session-panel session-timebox content-card">
        <div className="session-section-heading"><div><div className="eyebrow">ALUR KELAS · 30 MENIT</div><h2>Timebox dan aturan</h2></div></div>
        <ol><li><strong>0–5 menit:</strong> baca konteks, evidence, dan requirement.</li><li><strong>5–20 menit:</strong> lengkapi analisis.</li><li><strong>20–30 menit:</strong> diskusi dan jelaskan reasoning.</li></ol>
        <p>Gunakan SUT dari sisi pengguna. Jangan membuka source atau menuliskan root cause pada Session 1.</p>
        <a className="session-template-link" href="/downloads/verification-validation/session-1-objective-level-worksheet.csv" download>Unduh template worksheet kosong (CSV) →</a>
      </section>
    </section>
  )
}
