import { Link } from 'react-router-dom'
import { Session4Worksheet } from '../components/Session4Worksheet'
import { verificationValidationRoutes } from '../routes'

const mutants = [
  ['M01', 'KILLED', 'Positive quantity boundary', 'Evidence pack menunjukkan perbedaan pada boundary quantity positif.'],
  ['M02', 'SURVIVED', 'Exact-stock boundary', 'Evidence belum cukup kuat untuk membedakan exact-stock dari mutant amount ≥ stock sebagai over-stock.'],
  ['M03', 'KILLED', 'Whole-number unit validation', 'Evidence pack menunjukkan perbedaan pada validasi unit bilangan bulat.'],
  ['M04', 'SURVIVED', 'Decimal precision boundary', 'Evidence belum cukup kuat untuk membedakan precision 3 decimal dari mutant yang menerima 4 decimal.'],
] as const

const profile = [
  ['View Inventory', '35%'],
  ['Stock Inbound', '25%'],
  ['Stock Outbound', '25%'],
  ['Stock History', '10%'],
  ['Archive / Restore', '5%'],
] as const

export function VerificationValidationSession4Page() {
  return (
    <section className="s4-page" aria-labelledby="session4-title">
      <Link className="back-link" to={verificationValidationRoutes.basePath}>← Kembali ke course roadmap</Link>

      <header className="content-card s4-hero">
        <div className="s4-hero-copy">
          <div className="eyebrow">SESSION 4 · MINI CASE</div>
          <h1 id="session4-title">Memilih Kombinasi Teknik dan Membaca Test Metrics pada Techlith Lab Inventory</h1>
          <p>Baca evidence sebagai petunjuk untuk analisis, lalu susun strategi improvement yang dapat ditelusuri.</p>
        </div>
        <div className="s4-hero-facts"><span><strong>Delivery</strong>Mini Case</span><span><strong>Durasi</strong>± 35 menit</span></div>
        <div className="s4-output"><strong>Output</strong><span>Interpretasi metric, kombinasi teknik, keputusan prioritas, improvement plan, dan carry-forward evidence.</span></div>
      </header>

      <section className="content-card s4-panel" aria-labelledby="s4-carry-title">
        <div className="eyebrow">CARRY-FORWARD · SESSION 2–3</div>
        <h2 id="s4-carry-title">Hubungkan rancangan dengan evidence source-level</h2>
        <p>Dari Session 2, gunakan requirement-to-technique mapping, EP/BVA reasoning, experience-based ideas, enam candidate test ID `TC-INV-001`–`TC-INV-006`, dan expected result berbasis requirement. Dari Session 3, gunakan code-based, fault-based, usage-based, serta model-based reasoning dan evidence yang Anda kumpulkan sendiri.</p>
        <p className="s4-note">Evidence pack kelas adalah dataset interpretasi bersama. Angkanya tidak dimaksudkan sebagai klaim bahwa setiap mahasiswa memperoleh output yang sama dari test yang mereka tulis pada Session 3. Anda tetap boleh membandingkannya dengan evidence sendiri.</p>
      </section>

      <section className="content-card s4-panel" aria-labelledby="s4-metrics-title">
        <div className="s4-section-heading"><div><div className="eyebrow">NORMALIZED CLASSROOM EVIDENCE</div><h2 id="s4-metrics-title">Baca angka sebelum menyusun conclusion</h2></div><span className="s4-badge">Dataset kelas</span></div>
        <p>Pack dinormalisasi agar semua kelas membaca dataset yang sama. Session 4 tidak mengubah source Session 3 untuk menghasilkan angka tertentu. Setiap metric adalah satu jenis evidence; interpretasikan bersama, bukan sebagai verdict kualitas keseluruhan.</p>
        <div className="s4-metric-grid">
          <article><span>STATEMENT COVERAGE</span><strong>88%</strong><p>Statement yang tercakup pada dataset.</p></article>
          <article><span>BRANCH COVERAGE</span><strong>72%</strong><p>Branch yang tercakup pada dataset.</p></article>
          <article><span>MUTATION SCORE</span><strong>50%</strong><p>50% dari controlled mutant pada dataset ini terdeteksi.</p></article>
          <article><span>MUTANTS KILLED</span><strong>2 / 4</strong><p>Controlled mutant yang dibedakan evidence pack.</p></article>
          <article><span>MUTANTS SURVIVED</span><strong>2 / 4</strong><p>Mutant yang belum dibedakan oleh evidence pack.</p></article>
        </div>
        <div className="s4-interpretation-cues">
          <p>Coverage menunjukkan bagian code structure yang dikunjungi oleh test; angka coverage sendiri tidak membuktikan fault detection yang kuat.</p>
          <p>Mutation score menunjukkan hasil terhadap controlled variants pada dataset ini; metric itu tidak otomatis menggantikan coverage atau bukti lain.</p>
          <p>Gunakan metric, test design, risk, operational profile, dan model state bersama sebelum menyusun conclusion.</p>
        </div>
        <a className="s4-download-link" href="/downloads/verification-validation/session-4-normalized-evidence-pack.csv" download>Download normalized evidence pack CSV →</a>
      </section>

      <section className="content-card s4-panel" aria-labelledby="s4-mutants-title">
        <div className="eyebrow">FAULT-BASED EVIDENCE</div>
        <h2 id="s4-mutants-title">Status controlled mutants</h2>
        <div className="table-wrap s4-table-wrap">
          <table className="s4-table">
            <thead><tr><th>Mutant</th><th>Status</th><th>Focus</th><th>Interpretation cue</th></tr></thead>
            <tbody>{mutants.map(([id, status, focus, cue]) => <tr key={id}><td data-label="Mutant"><code>{id}</code></td><td data-label="Status"><span className={`s4-status s4-status-${status.toLowerCase()}`}>{status}</span></td><td data-label="Focus">{focus}</td><td data-label="Interpretation cue">{cue}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="s4-muted">Killed/survived adalah hasil dalam evidence pack normalized ini. Gunakan status tersebut untuk menentukan test distinction dan bukti lanjutan; jangan simpulkan kualitas keseluruhan dari satu status.</p>
      </section>

      <section className="content-card s4-panel" aria-labelledby="s4-usage-title">
        <div className="eyebrow">USAGE-BASED PRIORITIZATION</div>
        <h2 id="s4-usage-title">Classroom operational profile</h2>
        <p>Profile ini sama dengan Session 3 dan merupakan input latihan kelas, bukan production telemetry. Frekuensi membantu membaca usage, tetapi frekuensi tertinggi tidak otomatis selalu menjadi prioritas tertinggi; pertimbangkan risk dan evidence gap juga.</p>
        <div className="s4-profile-grid">{profile.map(([activity, frequency]) => <article key={activity}><span>{activity}</span><strong>{frequency}</strong></article>)}<article className="s4-profile-total"><span>Total</span><strong>100%</strong></article></div>
      </section>

      <section className="content-card s4-panel" aria-labelledby="s4-state-title">
        <div className="eyebrow">MODEL-BASED EVIDENCE</div>
        <h2 id="s4-state-title">State-transition evidence dan gap</h2>
        <div className="s4-state-callout">
          <strong>Baseline sudah memverifikasi bahwa item `ARCHIVED` menolak movement baru.</strong>
          <p>Gap yang tersisa adalah incomplete state-transition coverage, terutama `restore → ACTIVE`, persistence/availability of historical movement evidence, serta behavior lintas state setelah archive/restore.</p>
        </div>
        <div className="s4-state-grid"><article><code>ACTIVE → archive → ARCHIVED</code><span>Archive state dan movement eligibility</span></article><article><code>ARCHIVED → restore → ACTIVE</code><span>Transition evidence masih incomplete</span></article><article><code>History across archive / restore</code><span>Persistence dan availability perlu evidence</span></article><article><code>Movement after restore</code><span>Lintas-state consistency perlu diperiksa</span></article></div>
        <p className="s4-muted">Ini adalah coverage/evidence gap untuk diuji; jangan menyimpulkan bahwa gap tersebut sudah terbukti sebagai defect.</p>
      </section>

      <section className="content-card s4-panel" aria-labelledby="s4-tasks-title">
        <div className="eyebrow">MINI CASE TASKS</div>
        <h2 id="s4-tasks-title">Bangun conclusion melalui kombinasi evidence</h2>
        <div className="s4-task-grid">
          <article><h3>Task A — Interpret metrics</h3><p>Catat apa yang ditunjukkan statement coverage, branch coverage, dan mutation score. Catat pula apa yang belum bisa disimpulkan dari metric itu sendiri.</p></article>
          <article><h3>Task B — Select / combine techniques</h3><p>Gabungkan code-based, fault-based, usage-based, dan model-based evidence. Hubungkan dengan requirement/objective, experience-based ideas, dan input-domain EP/BVA dari Session 2.</p></article>
          <article><h3>Task C — Prioritize improvements</h3><p>Bandingkan risk, classroom usage frequency, dan evidence gap. Beri alasan untuk prioritas; jangan memakai frequency saja sebagai aturan otomatis.</p></article>
          <article><h3>Task D — Build improvement plan</h3><p>Tulis tindakan test/evidence yang spesifik, signal yang ingin diamati, dan traceability ke requirement, mutant, atau model state.</p></article>
        </div>
      </section>

      <Session4Worksheet />

      <section className="content-card s4-panel s4-carry-forward" aria-labelledby="s4-next-title">
        <div className="eyebrow">CARRY-FORWARD TO SESSION 5</div>
        <h2 id="s4-next-title">Siapkan improvement plan untuk evaluasi berikutnya</h2>
        <ul>
          <li>Daftar test yang akan ditambah atau diperbaiki.</li>
          <li>Mutant yang perlu ditarget dan evidence pembeda yang dibutuhkan.</li>
          <li>Branch serta state-transition gap yang perlu ditutup.</li>
          <li>Risk, usage priority, dan evidence yang akan direkam.</li>
          <li>Traceability dari setiap action ke requirement, mutant, atau model.</li>
        </ul>
        <p>Session 5 akan menggunakan rencana dan work products tersebut untuk evaluasi test suite. Pada Session 4, catat expected improvement signal tanpa menyatakannya sebagai hasil yang sudah tercapai.</p>
      </section>

      <section className="content-card s4-panel s4-rules" aria-labelledby="s4-rules-title">
        <div className="eyebrow">RULES &amp; TROUBLESHOOTING</div>
        <h2 id="s4-rules-title">Panduan singkat</h2>
        <ul>
          <li>Jika angka berbeda dari test pribadi Anda, bandingkan sumber dan scope evidence; pack kelas dan test mahasiswa memiliki tujuan berbeda.</li>
          <li>Jika satu teknik belum menjawab gap, tambahkan teknik pendukung dan tentukan evidence yang dibutuhkan.</li>
          <li>Jika worksheet akan hilang setelah reload, unduh CSV berisi isian terlebih dahulu.</li>
          <li>Perlakukan state-transition gap sebagai pertanyaan evidence sampai ada hasil yang mendukung conclusion.</li>
        </ul>
      </section>
    </section>
  )
}
