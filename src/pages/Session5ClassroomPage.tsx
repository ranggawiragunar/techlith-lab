const scenarios = [
  {
    id: 'INT-01',
    activity: 'Seed baseline; jalankan inbound 5 pada ITM-001 dengan Baseline dan injeksi Normal.',
    evidence: 'UI, dokumen item, history reference, dan dokumen stocktaking.',
  },
  {
    id: 'INT-02',
    activity: 'Lanjutkan dari INT-01; jalankan outbound 3 pada ITM-001.',
    evidence: 'UI, dua history reference, dokumen outbound, dan report inbound/outbound.',
  },
  {
    id: 'INT-03',
    activity: 'Seed baseline; jalankan outbound 10 pada ITM-001.',
    evidence: 'UI, current stock, history reference, dan nextAmount stocktaking.',
  },
  {
    id: 'INT-04',
    activity: 'Seed baseline; jalankan outbound 11 pada ITM-001.',
    evidence: 'Pesan runtime dan pemeriksaan bahwa item, history, dan stocktakings tidak berubah.',
  },
  {
    id: 'ERR-01',
    activity: 'Seed baseline; pilih Baseline, inbound 5, dan injeksi stocktaking-write.',
    evidence: 'Runtime message serta state items, stocktakings, dan stocktakingHistory.',
  },
  {
    id: 'ERR-02',
    activity: 'Seed baseline; pilih Baseline, inbound 5, dan injeksi item-update.',
    evidence: 'Runtime message, hasil rollback, serta state kedua collection dan history.',
  },
  {
    id: 'RET-01',
    activity: 'Seed baseline; ulangi inbound 5 Normal menggunakan Reference Safe Flow.',
    evidence: 'UI, item, stocktaking, history reference, dan report.',
  },
  {
    id: 'RET-02',
    activity: 'Seed baseline; ulangi injeksi stocktaking-write dengan Reference Safe Flow.',
    evidence: 'Runtime message dan state akhir items, stocktakings, serta history.',
  },
  {
    id: 'RET-03',
    activity: 'Seed baseline; ulangi injeksi item-update dengan Reference Safe Flow.',
    evidence: 'Runtime message, rollback, dan state akhir items, stocktakings, serta history.',
  },
  {
    id: 'REG-01',
    activity: 'Seed baseline; uji outbound 10 pada ITM-001 menggunakan flow yang sedang diretest.',
    evidence: 'UI, item, history reference, dan stocktaking dengan nextAmount.',
  },
  {
    id: 'REG-02',
    activity: 'Seed baseline; uji outbound 11 pada ITM-001 menggunakan flow yang sedang diretest.',
    evidence: 'Runtime message dan pemeriksaan bahwa tidak ada perubahan data.',
  },
]

const templates = [
  { name: 'Execution Record INT-01 sampai INT-04', file: 'execution-record.csv', format: 'CSV' },
  { name: 'Failure Investigation ERR-01 dan ERR-02', file: 'failure-investigation.md', format: 'Markdown' },
  { name: 'Bug Report', file: 'bug-report.md', format: 'Markdown' },
  { name: 'Retest dan Integration Regression', file: 'retest-regression.csv', format: 'CSV' },
  { name: 'Mini RTM', file: 'mini-rtm.csv', format: 'CSV' },
  { name: 'Test Summary', file: 'test-summary.md', format: 'Markdown' },
]

const workflow = [
  'Unduh ZIP Classroom Build dan ekstrak ke folder kerja lokal.',
  'Buka terminal pada folder project hasil ekstrak dan jalankan npm install.',
  'Di Terminal 1, jalankan Firestore Emulator dan tunggu sampai siap.',
  'Di Terminal 2, jalankan npm run seed untuk baseline awal.',
  'Di Terminal 2, jalankan npm start lalu buka React Classroom dan Emulator UI.',
  'Jalankan success path INT-01 sampai INT-04; reset sebelum skenario yang mensyaratkan stock awal.',
  'Jalankan failure path ERR-01 dan ERR-02 dengan Baseline; catat hasil aktual tanpa menyimpulkan dari pesan UI saja.',
  'Kumpulkan evidence UI, items, stocktakings, stocktakingHistory, runtime messages, dan report.',
  'Investigasi temuan dan isi Bug Report hanya jika didukung evidence.',
  'Pilih Reference Safe Flow; jalankan RET-01 sampai RET-03.',
  'Jalankan regression REG-01 dan REG-02 dari baseline baru.',
  'Lengkapi Execution Record, Mini RTM, dan Test Summary berdasarkan hasil sendiri.',
]

const troubleshooting = [
  { issue: 'Command firebase tidak ditemukan', action: 'Pastikan npm install berhasil pada folder Classroom Build; Firebase CLI disediakan sebagai dependency lokal.' },
  { issue: 'Emulator meminta Java', action: 'Pastikan Java 21 atau lebih baru tersedia dan periksa dengan java -version.' },
  { issue: 'Port 8080 atau 4000 sedang digunakan', action: 'Hentikan emulator lama yang memang milik Anda, atau ubah port secara konsisten pada firebase.json dan src/firebase/client.ts. Tetap gunakan loopback.' },
  { issue: 'Aplikasi belum menampilkan data', action: 'Pastikan emulator siap lebih dahulu, lalu jalankan npm run seed dan muat ulang aplikasi.' },
  { issue: 'Precondition skenario tercampur', action: 'Jalankan npm run seed untuk menghapus data uji emulator dan mengembalikan baseline sebelum skenario independen.' },
  { issue: 'Hasil failure injection berbeda', action: 'Catat hasil aktual dan evidence dari emulator. Jangan mengubah hasil agar cocok dengan dugaan; periksa runtime dan state tiap collection.' },
]

export function Session5ClassroomPage() {
  return (
    <div className="session5-classroom">
      <div className="page-heading session5-page-heading">
        <div>
          <div className="eyebrow">CLASSROOM LABS · SESI 5</div>
          <h1>Integration Testing Stocktaking</h1>
          <p>Uji konsistensi transaksi inventory lintas komponen dan dokumentasikan evidence aktual.</p>
        </div>
        <a className="button button-primary session5-download" href="/downloads/session-5-firestore-emulator-classroom.zip" download>
          Unduh Classroom Build Sesi 5
        </a>
      </div>

      <section className="content-card session5-intro-card" aria-labelledby="session5-intro-title">
        <div className="session5-facts">
          <div><span>Mata Kuliah</span><strong>Pengujian Perangkat Lunak</strong></div>
          <div><span>Sesi</span><strong>5</strong></div>
          <div><span>Durasi</span><strong>±90 menit</strong></div>
          <div><span>Sistem Under Test</span><strong>Techlith Inventory Core · Classroom Build S5</strong></div>
          <div><span>Materi</span><strong>P10 Integration Testing · P11 Testing Documentation</strong></div>
        </div>
        <div className="session5-intro-copy">
          <h2 id="session5-intro-title">Tentang praktikum</h2>
          <p>Praktikum ini memeriksa hubungan antara form stocktaking, collection <code>stocktakings</code>, data <code>items</code>, <code>stocktakingHistory</code>, dan report. Pengujian dilakukan manual pada Firestore Emulator lokal; portal Techlith Lab tidak menjalankan transaksi praktikum.</p>
          <ul>
            <li>Mengidentifikasi integration point dan memeriksa state pada lebih dari satu collection.</li>
            <li>Menjalankan success path dan failure injection, lalu membandingkan pesan UI dengan data aktual.</li>
            <li>Mengumpulkan evidence untuk bug report, mini RTM, test summary, retest, dan regression.</li>
          </ul>
          <p className="session5-approach"><strong>Pendekatan:</strong> Manual Integration Testing · Failure Injection · Evidence Collection · Bug Reporting · Requirement Traceability Matrix · Test Summary · Retesting · Integration Regression.</p>
        </div>
      </section>

      <section className="session5-section" aria-labelledby="session5-environment-title">
        <div className="session5-section-heading"><div><div className="eyebrow">01 · PERSIAPAN</div><h2 id="session5-environment-title">Siapkan lingkungan lokal</h2></div></div>
        <div className="session5-grid session5-two-columns">
          <article className="content-card session5-card">
            <h3>Software yang diperlukan</h3>
            <ul className="session5-plain-list">
              <li>Node.js dan npm.</li>
              <li>Java 21 atau lebih baru.</li>
              <li>Firebase CLI dari dependency project, tanpa instalasi global.</li>
              <li>Browser lokal dan terminal.</li>
            </ul>
            <p className="session5-muted">Lingkungan yang diverifikasi: Java 21.0.12.1, Node.js 23.4.0, npm 10.9.2, dan Firebase CLI 15.33.0. Node.js 24 LTS direkomendasikan untuk setup baru karena sesuai dengan rentang major superstatic@10.0.0 (20, 22, 24), tetapi belum diuji untuk Classroom Build ini. Node.js 23.4.0 berhasil diuji, namun berada di luar rentang tersebut.</p>
          </article>
          <article className="content-card session5-card session5-safety">
            <h3>Hanya Firestore Emulator lokal</h3>
            <dl>
              <div><dt>Project ID</dt><dd><code>demo-techlith-inventory-classroom</code></dd></div>
              <div><dt>Firestore Emulator</dt><dd><code>127.0.0.1:8080</code></dd></div>
              <div><dt>Emulator UI</dt><dd><code>127.0.0.1:4000</code></dd></div>
            </dl>
            <p>Login Firebase dan credential production tidak diperlukan. Jangan jalankan <code>firebase deploy</code> dan jangan deploy <code>firestore.rules</code> classroom ke production. Jangan expose port emulator ke jaringan publik atau tidak tepercaya.</p>
          </article>
        </div>
        <div className="content-card session5-card session5-commands">
          <h3>Urutan menjalankan project</h3>
          <ol className="session5-setup-list">
            <li>Unduh ZIP, ekstrak, lalu buka terminal pada folder project.</li>
            <li>Instal dependency: <code>npm install</code></li>
            <li><strong>Terminal 1</strong> — jalankan emulator dan tunggu sampai siap:</li>
          </ol>
          <pre><code>npm run emulators</code></pre>
          <ol className="session5-setup-list" start={4}>
            <li><strong>Terminal 2</strong> — isi baseline setelah emulator siap, lalu jalankan app:</li>
          </ol>
          <pre><code>{'npm run seed\nnpm start'}</code></pre>
          <div className="session5-local-links">
            <a href="http://127.0.0.1:3000" target="_blank" rel="noreferrer">Buka React Classroom · 127.0.0.1:3000 ↗</a>
            <a href="http://127.0.0.1:4000" target="_blank" rel="noreferrer">Buka Emulator UI · 127.0.0.1:4000 ↗</a>
          </div>
          <p className="session5-muted">Alamat 127.0.0.1 dan localhost menunjuk ke komputer Anda sendiri. Portal yang di-host tidak dapat menyalakan proses lokal tersebut.</p>
        </div>
      </section>

      <section className="session5-section" aria-labelledby="session5-workflow-title">
        <div className="session5-section-heading"><div><div className="eyebrow">02 · ALUR PRAKTIKUM</div><h2 id="session5-workflow-title">Ikuti alur pengujian</h2></div></div>
        <ol className="session5-workflow">
          {workflow.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <p className="session5-reset-callout"><strong>Reset untuk precondition baru:</strong> jalankan <code>npm run seed</code> secara manual. Seed mengosongkan data test di emulator lokal dan mengembalikan tiga item baseline. Reset tidak berjalan otomatis. Jangan memakai hasil skenario sebelumnya kecuali precondition menyatakannya.</p>
      </section>

      <section className="session5-section" aria-labelledby="session5-scenarios-title">
        <div className="session5-section-heading"><div><div className="eyebrow">03 · TEST CASE</div><h2 id="session5-scenarios-title">Skenario dan evidence</h2></div></div>
        <p className="session5-section-intro">Gunakan kolom ini sebagai panduan aksi dan persiapan. Catat actual result, status, dan kesimpulan sendiri setelah memeriksa runtime serta Firestore Emulator.</p>
        <div className="content-card session5-table-card">
          <div className="session5-table-wrap">
            <table className="session5-table">
              <thead><tr><th scope="col">Scenario ID</th><th scope="col">Aktivitas dan persiapan</th><th scope="col">Evidence yang dikumpulkan</th></tr></thead>
              <tbody>{scenarios.map((scenario) => <tr key={scenario.id}><th scope="row"><code>{scenario.id}</code></th><td>{scenario.activity}</td><td>{scenario.evidence}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="session5-grid session5-two-columns session5-section">
        <article className="content-card session5-card">
          <div className="eyebrow">04 · EVIDENCE</div>
          <h2>Ambil bukti lintas komponen</h2>
          <p>Periksa React Classroom UI, runtime messages, collection <code>items</code>, collection <code>stocktakings</code>, <code>stocktakingHistory</code>, dan inbound/outbound report. Pesan sukses saja belum membuktikan konsistensi data.</p>
          <p>Ambil screenshot Anda sendiri dari UI dan Emulator UI. Kaitkan setiap gambar dengan Scenario ID agar evidence dapat ditelusuri.</p>
          <ul className="session5-evidence-examples">
            <li><code>S5_INT01_UI.png</code></li>
            <li><code>S5_INT01_ITEM_DOC.png</code></li>
            <li><code>S5_INT01_STOCKTAKING_DOC.png</code></li>
            <li><code>S5_INT02_UI.png</code></li>
            <li><code>S5_INT02_STOCKTAKING_DOC.png</code></li>
          </ul>
        </article>
        <article className="content-card session5-card">
          <div className="eyebrow">05 · DOKUMENTASI</div>
          <h2>Template kosong</h2>
          <p>Unduh file yang diperlukan dan isi berdasarkan hasil pengujian Anda. Tidak ada hasil, status, defect conclusion, atau metrik yang diisi otomatis.</p>
          <ul className="session5-template-list">
            {templates.map((template) => (
              <li key={template.file}>
                <a href={`/downloads/session-5-templates/${template.file}`} download>{template.name}<span aria-hidden="true">↓</span></a>
                <small>{template.format} · editable</small>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="session5-section" aria-labelledby="session5-troubleshoot-title">
        <div className="session5-section-heading"><div><div className="eyebrow">06 · BANTUAN</div><h2 id="session5-troubleshoot-title">Troubleshooting</h2></div></div>
        <div className="content-card session5-table-card">
          <div className="session5-table-wrap">
            <table className="session5-table session5-help-table">
              <thead><tr><th scope="col">Masalah</th><th scope="col">Tindakan</th></tr></thead>
              <tbody>{troubleshooting.map((entry) => <tr key={entry.issue}><th scope="row">{entry.issue}</th><td>{entry.action}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="content-card session5-card session5-completion" aria-labelledby="session5-completion-title">
        <div className="eyebrow">07 · SEBELUM SELESAI</div>
        <h2 id="session5-completion-title">Checklist praktikum</h2>
        <ul className="session5-checklist">
          <li>Emulator lokal siap dan baseline seed sudah diperiksa.</li>
          <li>INT-01 sampai INT-04 diperiksa dengan evidence lintas komponen.</li>
          <li>ERR-01 dan ERR-02 dibandingkan dengan consistency rule.</li>
          <li>Retest Reference Safe Flow dan regression dicatat.</li>
          <li>Execution Record, Bug Report bila terkonfirmasi, Mini RTM, dan Test Summary dilengkapi.</li>
        </ul>
        <p className="session5-muted">Template jawaban disimpan oleh Anda sendiri. Portal tidak menyimpan jawaban di IndexedDB atau Firestore.</p>
      </section>
    </div>
  )
}
