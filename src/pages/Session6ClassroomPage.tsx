const SESSION_6_DOWNLOAD_PATH = '/downloads/session-6-release-candidate-classroom.zip'

const setupSteps = [
  'Unduh Release Candidate ZIP setelah tautan berubah menjadi tersedia.',
  'Ekstrak arsip ke folder kerja lokal.',
  'Buka terminal pada direktori project hasil ekstrak.',
  'Instal dependency dari lockfile dengan npm ci.',
  'Pada Terminal 1, jalankan npm run emulators dan tunggu sampai Firestore Emulator siap.',
  'Pada Terminal 2, jalankan npm run seed untuk mengisi baseline.',
  'Pada Terminal 2, jalankan npm start.',
  'Buka aplikasi lokal di http://127.0.0.1:3000 dan Emulator UI di http://127.0.0.1:4000.',
  'Jalankan SMK-01 sampai SMK-05 dan simpan observasi serta evidence aktual.',
  'Jika semua smoke test kritis lulus, jalankan npm run seed sebelum acceptance test.',
  'Jalankan ACC-01 sampai ACC-05. Setiap kasus independen yang memerlukan baseline harus dimulai dengan seed baru.',
  'Bandingkan pesan aplikasi dengan dokumen aktual di Data Inspector dan Firestore Emulator UI.',
  'Lengkapi enam template berdasarkan hasil sendiri, lalu tentukan risiko dan keputusan penerimaan.',
]

const smokeCases = [
  ['SMK-01', 'Release candidate dapat dibuka tanpa error fatal.'],
  ['SMK-02', 'Tiga item baseline tampil: ITM-001, ITM-002, dan ITM-003.'],
  ['SMK-03', 'Jalankan inbound 1 pada ITM-001.'],
  ['SMK-04', 'Setelah SMK-03, jalankan outbound 1 pada ITM-001. Kasus ini bergantung pada state hasil SMK-03.'],
  ['SMK-05', 'Cocokkan item, stocktakings, dan stocktakingHistory di Data Inspector serta Emulator UI.'],
]

const acceptanceCases = [
  ['ACC-01', 'AC-01', 'Periksa baseline inventory dan history ITM-001.', 'ITM-001 terlihat dengan jumlah dan unit baseline; history dapat diperiksa.'],
  ['ACC-02', 'AC-02, AC-05', 'Dari baseline, jalankan inbound 5.', 'Stok ITM-001 berubah 10 menjadi 15; satu transaction dan satu history reference konsisten.'],
  ['ACC-03', 'AC-03, AC-05', 'Seed baseline, lalu uji outbound 10.', 'Stok ITM-001 menjadi 0; transaction mencatat previous 10 dan next 0.'],
  ['ACC-04', 'AC-04', 'Seed baseline, lalu uji outbound 11.', 'Operasi ditolak; stok tetap 10 dan tidak ada transaction atau history reference baru.'],
  ['ACC-05', 'AC-06', 'Seed baru untuk setiap mode failure injection; periksa pesan runtime dan state Firestore.', 'Kegagalan ditampilkan; tidak ada stock change, committed transaction, atau history reference.'],
]

const templates = [
  { name: 'Smoke Test Record', file: 'smoke-test-record.csv', format: 'CSV · editable' },
  { name: 'Acceptance Execution Record', file: 'acceptance-execution-record.csv', format: 'CSV · editable' },
  { name: 'Evidence Package Index', file: 'evidence-package-index.csv', format: 'CSV · editable' },
  { name: 'Residual Risk Review', file: 'residual-risk-review.csv', format: 'CSV · editable' },
  { name: 'Acceptance Summary and Release Decision', file: 'acceptance-summary-release-decision.md', format: 'Markdown · editable' },
  { name: 'Pilot Implementation Plan', file: 'pilot-implementation-plan.md', format: 'Markdown · editable' },
]

const evidenceIds = [
  ['EV-S6-01', 'SMK-01, SMK-02'],
  ['EV-S6-02', 'SMK-03, SMK-04'],
  ['EV-S6-03', 'SMK-05, ACC-01'],
  ['EV-S6-04', 'ACC-02, ACC-03'],
  ['EV-S6-05', 'ACC-04, ACC-05'],
  ['EV-S6-06', 'Risk review and release decision'],
]

export function Session6ClassroomPage() {
  return (
    <div className="session6-classroom">
      <div className="page-heading session6-page-heading">
        <div>
          <div className="eyebrow">CLASSROOM LABS · SESI 6</div>
          <h1>Sesi 6 — System Acceptance, Smoke Test, dan Implementation Readiness</h1>
          <p>Verifikasi release candidate dengan pengujian manual, evidence Firestore, review risiko, dan rencana pilot simulasi.</p>
        </div>
        <div className="session6-download-area">
          <a className="button button-primary session6-download" href={SESSION_6_DOWNLOAD_PATH} download>
            Unduh Release Candidate RC-1
          </a>
        </div>
      </div>

      <section className="content-card session6-intro-card" aria-labelledby="session6-overview-title">
        <div className="session6-facts">
          <div><span>Mata Kuliah</span><strong>Pengujian Perangkat Lunak</strong></div>
          <div><span>Sistem Under Test</span><strong>Techlith Inventory Core</strong></div>
          <div><span>Release Candidate</span><strong>RC-1</strong></div>
          <div><span>Durasi</span><strong>±90 menit</strong></div>
          <div><span>Materi</span><strong>P12 — System Acceptance</strong></div>
          <div><span>Materi</span><strong>P13 — System Implementation Strategy</strong></div>
        </div>
        <div className="session6-intro-copy">
          <h2 id="session6-overview-title">Tujuan pembelajaran</h2>
          <p>Gunakan hasil yang benar-benar diamati untuk menilai release candidate. Portal ini menyediakan panduan dan template kosong; portal tidak menjalankan layanan lokal dan tidak menentukan hasil praktikum Anda.</p>
          <ul>
            <li>Memverifikasi release candidate melalui smoke test dan menjalankan acceptance scenario secara manual.</li>
            <li>Mengumpulkan evidence objektif dari aplikasi dan Firestore Emulator, lalu menilai residual risk.</li>
            <li>Menetapkan keputusan penerimaan berdasarkan evidence dan merancang pilot implementasi simulasi, monitoring, serta rollback.</li>
          </ul>
          <p className="session6-approach"><strong>Hasil kerja:</strong> smoke record, acceptance execution record, evidence index, residual risk review, release decision, dan pilot implementation plan. Isi semua kesimpulan berdasarkan observasi Anda sendiri.</p>
        </div>
      </section>

      <section className="session6-section" aria-labelledby="session6-setup-title">
        <div className="session6-section-heading"><div><div className="eyebrow">01 · PERSIAPAN LOKAL</div><h2 id="session6-setup-title">Siapkan Release Candidate</h2></div></div>
        <div className="session6-grid session6-two-columns">
          <article className="content-card session6-card">
            <h3>Urutan setup</h3>
            <ol className="session6-setup-list">
              {setupSteps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </article>
          <article className="content-card session6-card session6-safety-card">
            <h3>Layanan lokal saja</h3>
            <p>Siapkan Node.js dan npm, Java 21 atau lebih baru untuk Firestore Emulator, serta browser. README merekomendasikan Node 24 LTS untuk setup baru.</p>
            <dl>
              <div><dt>Demo project</dt><dd><code>demo-techlith-inventory-session-6</code></dd></div>
              <div><dt>Classroom app</dt><dd><code>http://127.0.0.1:3000</code></dd></div>
              <div><dt>Firestore Emulator</dt><dd><code>127.0.0.1:8080</code></dd></div>
              <div><dt>Emulator UI</dt><dd><code>http://127.0.0.1:4000</code></dd></div>
            </dl>
            <p>Jalankan command pada direktori project hasil ekstrak. Hosted Techlith Lab hanya menyajikan instruksi; portal tidak menyalakan emulator atau aplikasi lokal di komputer Anda.</p>
            <div className="session6-local-links">
              <a href="http://127.0.0.1:3000" target="_blank" rel="noreferrer">Buka Classroom App ↗</a>
              <a href="http://127.0.0.1:4000" target="_blank" rel="noreferrer">Buka Firestore Emulator UI ↗</a>
            </div>
          </article>
        </div>
        <div className="content-card session6-card session6-commands">
          <h3>Command dari package standalone</h3>
          <p>Jalankan dari root project Session 6 yang sudah diekstrak. Gunakan dua terminal agar emulator tetap berjalan saat seed dan app dijalankan.</p>
          <div className="session6-terminal-grid">
            <div><strong>Terminal 1 · Firestore Emulator</strong><pre><code>npm run emulators</code></pre></div>
            <div><strong>Terminal 2 · install, seed, dan app</strong><pre><code>{'npm ci\nnpm run seed\nnpm start'}</code></pre></div>
          </div>
          <p className="session6-muted">Periksa emulator telah siap sebelum menjalankan seed. Setelah smoke test lulus, jalankan <code>npm run seed</code> lagi sebelum acceptance test. Seed mengatur ulang data emulator lokal; hasil lama tidak digunakan sebagai baseline baru.</p>
        </div>
      </section>

      <section className="session6-section" aria-labelledby="session6-smoke-title">
        <div className="session6-section-heading"><div><div className="eyebrow">02 · SMOKE TEST</div><h2 id="session6-smoke-title">Pastikan alur kritis siap</h2></div></div>
        <p className="session6-section-intro">Semua smoke test kritis harus PASS sebelum acceptance cycle dimulai. Jika ada kasus kritis FAIL atau BLOCKED, hentikan acceptance cycle, lalu catat masalah beserta evidence. Jangan mengisi hasil aktual pada panduan ini.</p>
        <div className="content-card session6-table-card"><div className="session6-table-wrap">
          <table className="session6-table"><thead><tr><th scope="col">Test ID</th><th scope="col">Tujuan / langkah</th><th scope="col">Expected result</th></tr></thead>
            <tbody>{smokeCases.map(([id, instruction]) => <tr key={id}><th scope="row"><code>{id}</code></th><td>{instruction}</td><td>{id === 'SMK-01' ? 'App terbuka dan siap diperiksa.' : id === 'SMK-02' ? 'ITM-001=10 meter, ITM-002=5 roll, dan ITM-003=100 pcs terlihat.' : id === 'SMK-03' ? 'Inbound 1 mengubah ITM-001 dari 10 menjadi 11 dan menghasilkan data yang dapat diperiksa.' : id === 'SMK-04' ? 'Outbound 1 setelah SMK-03 mengubah ITM-001 dari 11 menjadi 10.' : 'Item, transaction, dan history cocok saat diverifikasi melalui inspector dan Emulator UI.'}</td></tr>)}</tbody>
          </table>
        </div></div>
        <p className="session6-gate-note"><strong>Smoke gate:</strong> Keputusan gate: ____________________ &nbsp; Reviewer: ____________________ &nbsp; Evidence: ____________________</p>
      </section>

      <section className="session6-section" aria-labelledby="session6-acceptance-title">
        <div className="session6-section-heading"><div><div className="eyebrow">03 · ACCEPTANCE TEST</div><h2 id="session6-acceptance-title">Jalankan skenario penerimaan</h2></div></div>
        <p className="session6-section-intro">Untuk setiap kasus, tulis preconditions, input, expected result, actual result, status PASS / FAIL / BLOCKED, evidence Firestore, dan referensi screenshot. Periksa dokumen aktual; pesan sukses saja belum membuktikan data tersimpan konsisten.</p>
        <div className="content-card session6-table-card"><div className="session6-table-wrap">
          <table className="session6-table"><thead><tr><th scope="col">Test ID</th><th scope="col">Kriteria</th><th scope="col">Aktivitas</th><th scope="col">Expected result</th></tr></thead>
            <tbody>{acceptanceCases.map(([id, criteria, activity, expected]) => <tr key={id}><th scope="row"><code>{id}</code></th><td>{criteria}</td><td>{activity}</td><td>{expected} Catat actual result, status, precondition, Firestore evidence, dan referensi screenshot pada template.</td></tr>)}</tbody>
          </table>
        </div></div>
        <article className="content-card session6-card session6-acc05-card">
          <div className="eyebrow">PANDUAN KHUSUS · ACC-05</div>
          <h3>Uji kedua failure-injection mode</h3>
          <p>Practicum PDF mencantumkan ACC-05 tanpa langkah rinci. RC-1 menyediakan dua mode deterministik. Jalankan setiap mode dari seed baseline baru, lalu bandingkan runtime message, current stock, dokumen <code>stocktakings</code>, dan <code>stocktakingHistory</code> dengan acceptance criteria.</p>
          <ul><li><code>stocktaking-write</code> — amati kegagalan pada batas penulisan transaksi.</li><li><code>item-update</code> — amati kegagalan pada batas pembaruan item.</li></ul>
          <p>Catat hasil aktual setiap run. Panduan dan template tidak menandai skenario PASS secara otomatis.</p>
        </article>
      </section>

      <section className="session6-section" aria-labelledby="session6-criteria-title">
        <div className="session6-section-heading"><div><div className="eyebrow">04 · ACCEPTANCE CRITERIA</div><h2 id="session6-criteria-title">Hubungkan hasil test dengan kriteria</h2></div></div>
        <div className="content-card session6-table-card"><div className="session6-table-wrap">
          <table className="session6-table session6-criteria-table"><thead><tr><th scope="col">Criteria</th><th scope="col">Yang dinilai</th><th scope="col">Test terkait</th><th scope="col">Penilaian</th></tr></thead>
            <tbody>
              <tr><th scope="row"><code>AC-01</code></th><td>Inventory dapat terlihat dan dibaca.</td><td>ACC-01</td><td>Diisi mahasiswa</td></tr>
              <tr><th scope="row"><code>AC-02</code></th><td>Inbound valid menghasilkan perubahan data yang konsisten.</td><td>ACC-02</td><td>Diisi mahasiswa</td></tr>
              <tr><th scope="row"><code>AC-03</code></th><td>Outbound valid, termasuk hasil stok nol.</td><td>ACC-03</td><td>Diisi mahasiswa</td></tr>
              <tr><th scope="row"><code>AC-04</code></th><td>Jumlah outbound melebihi stok ditolak tanpa perubahan.</td><td>ACC-04</td><td>Diisi mahasiswa</td></tr>
              <tr><th scope="row"><code>AC-05</code></th><td>Transaksi berhasil konsisten pada item, stocktaking, dan history.</td><td>ACC-02, ACC-03</td><td>Diisi mahasiswa</td></tr>
              <tr><th scope="row"><code>AC-06</code></th><td>Transaksi gagal tidak meninggalkan perubahan parsial.</td><td>Kedua subkasus ACC-05</td><td>Diisi mahasiswa</td></tr>
              <tr><th scope="row"><code>AC-07</code></th><td>Seluruh smoke flow kritis lulus.</td><td>SMK-01–SMK-05</td><td>Diisi mahasiswa</td></tr>
            </tbody>
          </table>
        </div></div>
      </section>

      <section className="session6-grid session6-two-columns session6-section">
        <article className="content-card session6-card" aria-labelledby="session6-evidence-title">
          <div className="eyebrow">05 · EVIDENCE PACKAGE</div><h2 id="session6-evidence-title">Kumpulkan bukti yang dapat ditelusuri</h2>
          <p>Ambil screenshot aktual dari Classroom App, runtime messages, Data Inspector, dan Firestore Emulator UI. Pastikan gambar memperlihatkan konteks kasus dan state yang sedang diverifikasi; jangan memakai gambar ilustratif sebagai hasil test.</p>
          <ul className="session6-reference-list">{evidenceIds.map(([id, related]) => <li key={id}><code>{id}</code><span>Test terkait: {related}</span></li>)}</ul>
          <p className="session6-muted">Isi nama file, sumber capture, observasi, dan catatan pada Evidence Package Index. Jangan menyertakan credential atau data sensitif.</p>
        </article>
        <article className="content-card session6-card" aria-labelledby="session6-risk-title">
          <div className="eyebrow">06 · RESIDUAL RISK</div><h2 id="session6-risk-title">Nilai risiko yang masih tersisa</h2>
          <p>Residual risk adalah risiko yang tetap ada setelah kontrol dan hasil test dipertimbangkan. Tentukan likelihood, impact, risk level, mitigation, owner, review date, dan disposition dari evidence Anda.</p>
          <ul className="session6-risk-list">
            <li><code>RR-01</code><span>Konsistensi data stok dan history.</span></li>
            <li><code>RR-02</code><span>Perilaku batas outbound.</span></li>
            <li><code>RR-03</code><span>Penanganan error transaksi.</span></li>
            <li><code>RR-04</code><span>Fungsi yang berada di luar cakupan RC-1.</span></li>
          </ul>
          <p>Template tidak mengisi rating atau disposition. Jelaskan dasar penilaian, mitigasi, dan siapa yang menindaklanjuti.</p>
        </article>
      </section>

      <section className="session6-section" aria-labelledby="session6-decision-title">
        <div className="session6-section-heading"><div><div className="eyebrow">07 · RELEASE DECISION</div><h2 id="session6-decision-title">Tentukan keputusan dari evidence</h2></div></div>
        <div className="session6-grid session6-three-columns">
          <article className="content-card session6-decision-card"><h3>ACCEPT</h3><p>Semua acceptance criteria kritis lulus dan tidak ada high residual risk yang belum dapat diterima tanpa mitigasi.</p></article>
          <article className="content-card session6-decision-card"><h3>ACCEPT WITH CONDITIONS</h3><p>Alur kritis lulus; risiko non-blocking yang tersisa memiliki mitigasi, monitoring, owner, dan tenggat.</p></article>
          <article className="content-card session6-decision-card"><h3>NO-GO</h3><p>Kriteria kritis gagal atau terblokir, atau high residual risk yang tidak dapat diterima masih tersisa.</p></article>
        </div>
        <p className="session6-section-intro">Pilih satu hasil pada Acceptance Summary berdasarkan bukti aktual. Tidak ada keputusan yang dipilih sebelumnya oleh portal.</p>
      </section>

      <section className="session6-section" aria-labelledby="session6-pilot-title">
        <div className="session6-section-heading"><div><div className="eyebrow">08 · IMPLEMENTATION READINESS</div><h2 id="session6-pilot-title">Rancang pilot implementasi simulasi</h2></div></div>
        <div className="content-card session6-card">
          <p>Ini latihan perencanaan, bukan deployment production atau rollback sungguhan. Isi Pilot Implementation Plan untuk mendefinisikan batas pilot, kesiapan masuk, pemeriksaan sesudah deployment simulasi, monitoring, komunikasi, pemilik tindakan, dan exit criteria.</p>
          <div className="session6-grid session6-two-columns">
            <div><h3>Rencana pilot</h3><ul><li>Pilot scope dan objective.</li><li>Entry conditions dan responsible roles.</li><li>Pilot timeline dan post-deployment smoke.</li><li>Exit criteria.</li></ul></div>
            <div><h3>Monitoring dan rollback</h3><ul><li>Indikator: transaction errors, failed writes, stock/history mismatch, dan laporan anomali pengguna.</li><li>Tentukan frekuensi monitoring dan owner.</li><li>Trigger: critical transaction failure, false success, inkonsistensi stok/history, atau data yang tidak dapat dipulihkan.</li><li>Rinci rollback actions dan communication plan.</li></ul></div>
          </div>
        </div>
      </section>

      <section className="session6-section" aria-labelledby="session6-templates-title">
        <div className="session6-section-heading"><div><div className="eyebrow">09 · DOKUMENTASI MAHASISWA</div><h2 id="session6-templates-title">Unduh enam template kosong</h2></div></div>
        <p className="session6-section-intro">File CSV dan Markdown dapat diedit dengan spreadsheet atau text editor. Kolom observasi, status, evidence, rating, dan keputusan disediakan untuk diisi sendiri.</p>
        <div className="content-card session6-card">
          <ul className="session6-template-list">{templates.map((template) => (
            <li key={template.file}>
              <a href={`/downloads/session-6-templates/${template.file}`} download>{template.name}<span aria-hidden="true">↓</span></a>
              <small>{template.format}</small>
            </li>
          ))}</ul>
        </div>
      </section>

      <aside className="session6-security-note" aria-label="Batas penggunaan dan keamanan">
        <strong>Classroom Emulator only</strong>
        <p>Gunakan demo Firebase project dan layanan loopback di komputer sendiri. Data bersifat sementara. Jangan memakai production credentials, menjalankan production deployment, atau membuka port emulator ke jaringan publik.</p>
        <p>Dependency Release Candidate sebelumnya melaporkan 11 high, 10 moderate, dan 0 critical advisories. RC-1 adalah bahan praktikum, bukan produk yang disetujui untuk penggunaan production.</p>
      </aside>
    </div>
  )
}
