import { Link } from 'react-router-dom'
import { verificationValidationRoutes } from '../routes'

const requirements = [
  ['REQ-INV-001', 'Outbound quantity harus > 0.'],
  ['REQ-INV-002', 'Outbound quantity tidak boleh melebihi current stock. Exact-stock valid dan menghasilkan next stock = 0.'],
  ['REQ-INV-003', 'Whole-number units seperti pcs / unit hanya menerima quantity integer.'],
  ['REQ-INV-004', 'Fractional units seperti meter dapat menerima quantity pecahan dengan precision maksimal 3 decimal places.'],
  ['REQ-INV-005', 'Archived item tidak menerima movement baru. Existing movement history tetap tersedia.'],
  ['REQ-INV-006', 'Successful movement menjaga konsistensi prevAmount, amount, dan nextAmount.'],
] as const

const setupCommands = `# Extract session-3-inventory-classroom.zip, then enter the extracted folder
npm install
npm run test
npm run coverage
npm run mutation -- --list
npm run mutation -- --mutant M02
npm run mutation -- --summary
npm run build`

export function VerificationValidationSession3Page() {
  return (
    <section className="s3-page" aria-labelledby="session3-title">
      <Link className="back-link" to={verificationValidationRoutes.basePath}>← Kembali ke course roadmap</Link>

      <header className="content-card s3-hero">
        <div>
          <div className="eyebrow">SESSION 3 · PRAKTIKUM</div>
          <h1 id="session3-title">Menguji Kode, Fault, Usage, dan Model pada Techlith Lab Inventory</h1>
          <p>Dari rancangan black-box, lanjutkan ke test yang Anda tulis sendiri terhadap source rule set yang kecil dan terkontrol.</p>
        </div>
        <div className="s3-hero-facts"><span><strong>Delivery</strong>Praktikum</span><span><strong>Environment</strong>Isolated source</span></div>
        <div className="s3-output"><strong>Output</strong><span>Test buatan mahasiswa, fault-based reasoning, usage priority, state model checks, dan evidence hasil eksekusi.</span></div>
      </header>

      <section className="content-card s3-panel" aria-labelledby="s3-boundary-title">
        <div className="eyebrow">ENVIRONMENT BOUNDARY</div>
        <h2 id="s3-boundary-title">Dua environment dengan tujuan berbeda</h2>
        <div className="s3-boundary">
          <strong>Isolated Session 3 source adalah reference classroom rule set yang selaras dengan canonical requirements. Source ini bukan snapshot byte-for-byte dari Main Techlith Lab application.</strong>
          <p>Session 1–2 menggunakan Main Application untuk black-box/manual work. Session 3 menggunakan project lokal terpisah untuk membaca dan menguji source rules. Observation over-stock Session 1 pada Main Application tidak menetapkan behavior reference source; source mengikuti REQ-INV-002. Ini bukan penyebutan source sebagai “fixed version of the bug”.</p>
        </div>
        <h3>Canonical requirements</h3>
        <div className="session-reference-list">
          {requirements.map(([id, description]) => <article className="session-reference" key={id}><code>{id}</code><p>{description}</p></article>)}
        </div>
      </section>

      <section className="content-card s3-panel" aria-labelledby="s3-prereq-title">
        <div className="eyebrow">STARTER PROJECT</div>
        <h2 id="s3-prereq-title">Siapkan environment</h2>
        <p>Gunakan Node.js LTS dan npm. Starter tidak memerlukan database, Firebase Emulator, Java, Docker, atau cloud service. Unduh dan extract ZIP, lalu jalankan command dari folder `session-3-inventory-classroom`.</p>
        <div className="s3-links"><a className="button button-primary" href="/downloads/verification-validation/session-3-inventory-classroom.zip" download>Download Session 3 inventory classroom ZIP</a><a href="/downloads/verification-validation/session-3-practical-record.csv" download>Unduh practical record CSV</a></div>
        <pre className="s3-code"><code>{setupCommands}</code></pre>
        <p className="s3-muted">Starter menyertakan empat baseline orientasi yang sengaja belum lengkap; test tambahan tetap Anda rancang sendiri di folder `tests/`. Coverage dan mutation adalah feedback dari suite yang benar-benar Anda jalankan.</p>
      </section>

      <section className="content-card s3-panel" aria-labelledby="s3-source-map-title">
        <div className="eyebrow">SOURCE MAP</div>
        <h2 id="s3-source-map-title">Temukan rule yang akan diuji</h2>
        <ul className="s3-source-map">
          <li><code>src/types.ts</code> — inventory, movement, state, dan profile types.</li>
          <li><code>src/quantityRules.ts</code> — positive quantity, precision, dan unit domain.</li>
          <li><code>src/inventoryRules.ts</code> — reference outbound decision dan movement result.</li>
          <li><code>src/inventoryState.ts</code> / <code>src/itemState.ts</code> — ACTIVE/ARCHIVED transitions dan movement eligibility.</li>
          <li><code>src/usageProfile.ts</code> / <code>src/operationalProfile.ts</code> — classroom operational profile.</li>
          <li><code>src/mutants/M01.ts–M04.ts</code> — controlled variants untuk fault-based reasoning.</li>
          <li><code>mutants/manifest.json</code> — ID dan deskripsi variants.</li>
          <li><code>scripts/run-mutation.mjs</code> — perintah list, mutant tunggal, dan summary.</li>
          <li><code>tests/</code> — tempat Anda membuat dan mengembangkan test.</li>
          <li><code>src/main.ts</code> — halaman orientasi source; bukan duplicate inventory UI.</li>
        </ul>
      </section>

      <section className="content-card s3-panel" aria-labelledby="s3-tasks-title">
        <div className="eyebrow">PRACTICUM TASKS</div>
        <h2 id="s3-tasks-title">Rancang, jalankan, dan catat pekerjaan Anda</h2>
        <div className="s3-task-grid">
          <article className="s3-task"><h3>Task A — Code-based</h3><p>Baca rule kecil pada source. Buat test untuk requirement dan boundary pilihan Anda, termasuk satu atau lebih kandidat dari EP/BVA Session 2. Tentukan input dan expected dari requirement.</p></article>
          <article className="s3-task"><h3>Task B — Fault-based</h3><p>Bandingkan reference dengan M01–M04. Desain test yang membedakan behavior, jalankan pada reference, lalu jalankan atau adaptasi test secara terkontrol pada mutant. Catat perbedaan yang teramati.</p></article>
          <article className="s3-task"><h3>Task C — Usage-based</h3><p>Gunakan classroom operational profile untuk memilih urutan/prioritas scenario berdasarkan frequency dan risk. Jelaskan alasan prioritas Anda.</p></article>
          <article className="s3-task"><h3>Task D — Model-based</h3><p>Turunkan test dari ACTIVE, ARCHIVED, archive, restore, dan aturan movement eligibility. Periksa transisi dengan test buatan Anda.</p></article>
          <article className="s3-task"><h3>Task E — Evidence</h3><p>Jalankan test, coverage, dan build. Catat command, output yang relevan, input, actual result, evidence reference, serta notes pada practical record.</p></article>
        </div>
        <h3>Controlled fault variants</h3>
        <div className="s3-mutations">
          <article><strong>M01</strong><p>Perubahan positivity boundary agar zero dapat lolos.</p></article>
          <article><strong>M02</strong><p>Perubahan stock comparison yang dapat menolak exact-stock.</p></article>
          <article><strong>M03</strong><p>Whole-number unit validation dilewati.</p></article>
          <article><strong>M04</strong><p>Precision berubah dari tiga menjadi empat decimal places.</p></article>
        </div>
        <p className="s3-muted">Pilih satu perbedaan, lalu buktikan dengan test yang Anda buat. Starter tidak memberikan hasil mutant atau mutation score.</p>
      </section>

      <section className="content-card s3-panel" aria-labelledby="s3-profile-title">
        <div className="eyebrow">USAGE-BASED INPUT</div>
        <h2 id="s3-profile-title">Classroom operational profile</h2>
        <p>Profile ini menjadi input latihan prioritization, bukan observed production telemetry.</p>
        <div className="table-wrap"><table className="s3-profile"><thead><tr><th>Activity</th><th>Frequency</th></tr></thead><tbody><tr><td>View Inventory</td><td>35%</td></tr><tr><td>Stock Inbound</td><td>25%</td></tr><tr><td>Stock Outbound</td><td>25%</td></tr><tr><td>Stock History</td><td>10%</td></tr><tr><td>Archive / Restore</td><td>5%</td></tr></tbody><tfoot><tr><th>Total profile</th><th>100%</th></tr></tfoot></table></div>
        <h3>State model</h3>
        <pre className="s3-code"><code>ACTIVE --archive--&gt; ARCHIVED{`\n`}ARCHIVED --restore--&gt; ACTIVE</code></pre>
        <p className="s3-muted">State model berada di memori tanpa persistence. Existing movement history tetap tersedia saat item di-archive.</p>
      </section>

      <section className="content-card s3-panel" aria-labelledby="s3-carry-title">
        <div className="eyebrow">EVIDENCE · CARRY-FORWARD</div>
        <h2 id="s3-carry-title">Bawa hasil Session 2 ke pekerjaan source-level</h2>
        <ul className="s3-steps">
          <li>Requirement-to-technique mapping.</li>
          <li>EP/BVA reasoning dan input candidate.</li>
          <li>Experience-based ideas.</li>
          <li>Candidate test IDs `TC-INV-001` sampai `TC-INV-006`.</li>
          <li>Expected result yang diturunkan dari requirement.</li>
          <li>Pilih kandidat yang relevan untuk automated test; tidak semua harus menjadi unit test satu per satu.</li>
        </ul>
        <h3>Catat bukti yang dapat ditinjau</h3>
        <p>Isi practical record dengan Area, Test ID, Requirement / Model / Mutant, Technique, Input / Precondition, Expected, Actual, Result, Evidence, dan Notes. Jangan menyalin actual result dari expected result; rekam hasil yang benar-benar Anda amati.</p>
      </section>

      <section className="content-card s3-panel" aria-labelledby="s3-troubleshoot-title">
        <div className="eyebrow">TROUBLESHOOTING</div>
        <h2 id="s3-troubleshoot-title">Jika command tidak berjalan</h2>
        <ul className="s3-steps">
          <li>Pastikan terminal berada di folder hasil extract `session-3-inventory-classroom`.</li>
          <li>Periksa `node --version` dan gunakan Node.js LTS beserta npm.</li>
          <li>Jika dependency belum ada atau tidak cocok dengan lockfile, jalankan kembali `npm ci`.</li>
          <li>Jika belum ada test, buat file `.test.ts` di `tests/`; starter memang tidak berisi answer suite.</li>
        </ul>
        <p className="s3-muted">Session 4 akan membaca evidence yang Anda hasilkan. Session ini tidak menyediakan conclusion atau normalized metric target dari sesi berikutnya.</p>
      </section>
    </section>
  )
}
