import type { ReactNode } from 'react'

const SESSION_7_DOWNLOAD_PATH = '/downloads/session-7-final-release-classroom.zip'

const templates = [
  { name: 'Final Regression Record', file: 'Final_Regression_Record.csv', format: 'CSV · smoke and manual regression records' },
  { name: 'Final RTM', file: 'Final_RTM.csv', format: 'CSV · requirement and risk traceability' },
  { name: 'Final Test Summary', file: 'Final_Test_Summary.md', format: 'Markdown · metrics and recommendation' },
  { name: 'Automated Regression Evidence', file: 'Automated_Regression_Evidence.md', format: 'Markdown · command, totals, and evidence' },
  { name: 'Open Defect and Residual Risk Review', file: 'Open_Defect_Residual_Risk_Review.csv', format: 'CSV · defect and risk disposition' },
]

const smokeCases = [
  ['FSMK-01', 'Buka aplikasi classroom.', 'Aplikasi lokal terbuka tanpa error fatal.'],
  ['FSMK-02', 'Periksa baseline item dan history.', 'Tiga item baseline tampil; stocktakings dan history kosong.'],
  ['FSMK-03', 'Inbound 1 pada ITM-001.', 'Stok berubah dari 10 menjadi 11 dan menghasilkan satu transaksi yang dapat diverifikasi.'],
  ['FSMK-04', 'Outbound 1 pada ITM-001 tanpa reseed setelah FSMK-03.', 'Stok berubah dari 11 menjadi 10; transaksi kedua konsisten.'],
  ['FSMK-05', 'Bandingkan item, stocktakings, dan stocktakingHistory.', 'Stok terkini, catatan transaksi, dan referensi history konsisten.'],
]

const regressionCases = [
  ['REG-F-01', 'Baseline 10; outbound 0.', 'Ditolak; tidak ada mutasi. Catat lapisan validasi yang menolak.'],
  ['REG-F-02', 'Baseline 10; outbound 10.', 'Stok menjadi 0; satu catatan transaksi konsisten.'],
  ['REG-F-03', 'Baseline 10; outbound 11.', 'Ditolak; stok tetap 10 dan tidak ada catatan/history baru.'],
  ['REG-F-04', 'Baseline 10; inbound 5.', 'Stok menjadi 15; catatan transaksi dan history konsisten.'],
  ['REG-F-05', 'Baseline 10; inbound 5 lalu outbound 3.', 'Stok akhir 12; dua catatan dan dua referensi history.'],
  ['REG-F-06', 'Jalankan selected automated regression.', 'Product validation suite melaporkan hasil aktualnya.'],
  ['REG-F-07', 'Normal transaction, lalu tiap failure injection dari baseline terpisah.', 'Kegagalan tidak memberi false success atau state Firestore parsial.'],
]

const outputs = [
  ['Final Smoke Test Record', 'Final_Regression_Record.csv'],
  ['Final Manual Regression Record', 'Final_Regression_Record.csv'],
  ['Selected Automated Regression Result', 'Automated_Regression_Evidence.md'],
  ['Final RTM', 'Final_RTM.csv'],
  ['Open Defect / Residual Risk Review', 'Open_Defect_Residual_Risk_Review.csv'],
  ['Final Test Summary', 'Final_Test_Summary.md'],
  ['Final Tester Recommendation', 'Final_Test_Summary.md'],
]

function Section({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  const id = `session7-section-${number}`
  return <section className="session7-section" aria-labelledby={id}>
    <div className="session7-section-heading"><div><div className="eyebrow">{number}</div><h2 id={id}>{title}</h2></div></div>
    {children}
  </section>
}

export function Session7ClassroomPage() {
  return <div className="session7-classroom">
    <div className="page-heading session7-page-heading">
      <div>
        <div className="eyebrow">CLASSROOM LABS · SESI 7</div>
        <h1>Final Regression dan Release Readiness Techlith Inventory</h1>
        <p>Konsolidasikan evidence pengujian untuk menilai kesiapan rilis berdasarkan hasil aktual.</p>
      </div>
      <div className="session7-download-area">
        <a className="button button-primary session7-download" href={SESSION_7_DOWNLOAD_PATH} download>Unduh Final Release Classroom Build</a>
        <span>Final Regression · build package terverifikasi</span>
      </div>
    </div>

    <section className="content-card session7-intro" aria-labelledby="session7-overview">
      <div className="session7-facts">
        <div><span>Mata Kuliah</span><strong>Pengujian Perangkat Lunak</strong></div>
        <div><span>Sesi</span><strong>Sesi 7</strong></div>
        <div><span>Sistem Under Test</span><strong>Techlith Inventory Core — Final Release Classroom Build</strong></div>
        <div><span>Materi</span><strong>P14 Software Testing Project Case + P15 review/final consolidation</strong></div>
        <div><span>Durasi</span><strong>±90 menit</strong></div>
        <div><span>Backend</span><strong>Firestore Emulator lokal</strong></div>
      </div>
      <div className="session7-intro-copy">
        <h2 id="session7-overview">Tujuan sesi</h2>
        <p>Portal Techlith Lab yang di-host menyediakan instruksi dan berkas. Unduh Final Release Classroom Build dan jalankan secara lokal di komputer Anda. Portal hosted tidak menyalakan aplikasi lokal atau Firestore Emulator.</p>
        <p>Sesi ini mengonsolidasikan evidence dari domain inventory yang sama; sesi ini tidak memperkenalkan domain bisnis baru.</p>
        <p className="session7-callout"><strong>Prinsip kerja:</strong> template dan panduan menjelaskan expected result. Isi actual result, status, evidence, defect closure, risk disposition, dan recommendation hanya setelah Anda mengamati run sendiri.</p>
      </div>
    </section>

    <Section number="01 · CONTINUITY & ENTRY" title="Hubungkan bukti dari sesi sebelumnya">
      <div className="session7-grid session7-two-columns">
        <article className="content-card session7-card">
          <h3>Alur pembelajaran</h3>
          <ol className="session7-continuity">
            <li><strong>S1</strong><span>Requirement dan expected versus actual.</span></li>
            <li><strong>S2</strong><span>Quality risk dan testing strategy.</span></li>
            <li><strong>S3</strong><span>Manual boundary, defect, dan automation terpilih.</span></li>
            <li><strong>S5</strong><span>Integration testing dan dokumentasi.</span></li>
            <li><strong>S6</strong><span>Acceptance dan implementation readiness.</span></li>
            <li><strong>S7</strong><span>Final regression dan release readiness.</span></li>
          </ol>
          <p className="session7-muted">Sesi 4 tidak digunakan di sini sebagai runtime evidence.</p>
        </article>
        <article className="content-card session7-card">
          <h3>Entry criteria</h3>
          <ul>
            <li>Final Release Classroom Build stabil dan dapat dijalankan lokal.</li>
            <li>React app dan Firestore Emulator tersedia; baseline seed berhasil.</li>
            <li>Evidence S3/S5/S6 tersedia. Evidence milik mahasiswa diutamakan; paket referensi instruktur adalah fallback yang dilabeli jelas.</li>
            <li>Tidak ada environment blocker yang menghalangi critical flow.</li>
          </ul>
        </article>
      </div>
    </Section>

    <Section number="02 · LOCAL SETUP" title="Siapkan build di komputer sendiri">
      <div className="session7-grid session7-two-columns">
        <article className="content-card session7-card">
          <h3>Urutan kerja</h3>
          <ol className="session7-setup-list">
            <li>Ekstrak classroom build setelah ZIP tersedia dan buka terminal pada folder hasil ekstrak.</li>
            <li>Instal secara reproducible dengan <code>npm ci</code>.</li>
            <li>Terminal 1: jalankan <code>npm run emulators</code> dan tunggu emulator siap.</li>
            <li>Terminal 2: jalankan <code>npm run seed</code>, lalu <code>npm start</code>.</li>
            <li>Buka app lokal, jalankan smoke gate, simpan evidence, kemudian reseed sebelum manual regression.</li>
            <li>Jalankan selected automation dengan <code>npm run regression</code>.</li>
          </ol>
          <p className="session7-muted">Tutorial menyebut <code>npm install</code>. Karena build menyertakan lockfile, panduan ini merekomendasikan <code>npm ci</code> untuk instalasi bersih dan reproducible. Keduanya tidak dianggap identik.</p>
        </article>
        <article className="content-card session7-card session7-safety-card">
          <h3>Runtime dan endpoint lokal</h3>
          <dl>
            <div><dt>Runtime direkomendasikan</dt><dd>Node 24 LTS · Java 21+</dd></div>
            <div><dt>Demo project</dt><dd><code>demo-techlith-inventory-session-7</code></dd></div>
            <div><dt>App</dt><dd><code>http://127.0.0.1:3000</code></dd></div>
            <div><dt>Firestore Emulator</dt><dd><code>127.0.0.1:8080</code></dd></div>
            <div><dt>Emulator UI</dt><dd><code>http://127.0.0.1:4000</code></dd></div>
          </dl>
          <p><strong>FOR SUPERVISED LOCAL CLASSROOM USE.</strong> Gunakan Firestore Emulator dan loopback/local access saja. Jangan memakai production credentials, membuka emulator ke jaringan publik, atau deploy classroom Firestore rules ke production. Pembatasan ini berlaku untuk classroom build yang diunduh; portal Techlith Lab sendiri boleh di-host secara normal.</p>
        </article>
      </div>
      <article className="content-card session7-card session7-commands">
        <h3>Commands di folder classroom build</h3>
        <p>Jalankan emulator dan seed pada terminal terpisah. Seed mengembalikan dataset classroom; simpan evidence yang dibutuhkan sebelum reseed.</p>
        <div className="session7-terminal-grid">
          <div><strong>Terminal 1 · emulator</strong><pre><code>npm run emulators</code></pre></div>
          <div><strong>Terminal 2 · seed dan app</strong><pre><code>{'npm run seed\nnpm start'}</code></pre></div>
          <div><strong>Regression terpilih</strong><pre><code>npm run regression</code></pre></div>
        </div>
      </article>
    </Section>

    <Section number="03 · BASELINE DATASET" title="Pastikan baseline sesuai sebelum menguji">
      <div className="content-card session7-table-card"><div className="session7-table-wrap">
        <table className="session7-table"><caption>Dataset setelah seed Session 7</caption><thead><tr><th scope="col">Kode Barang</th><th scope="col">Nama</th><th scope="col">Stok</th><th scope="col">amountType</th><th scope="col">History</th></tr></thead>
          <tbody>
            <tr><th scope="row"><code>ITM-001</code></th><td>Kain Katun</td><td>10</td><td>meter</td><td>Kosong</td></tr>
            <tr><th scope="row"><code>ITM-002</code></th><td>Benang Hitam</td><td>5</td><td>roll</td><td>Kosong</td></tr>
            <tr><th scope="row"><code>ITM-003</code></th><td>Resleting</td><td>100</td><td>pcs</td><td>Kosong</td></tr>
          </tbody>
        </table>
      </div><p className="session7-table-note"><code>stocktakings</code> kosong setelah seed. Field satuan kanonis adalah <code>amountType</code>.</p></div>
    </Section>

    <Section number="04 · FINAL SMOKE GATE" title="Selesaikan smoke gate sebelum regression">
      <p className="session7-section-intro">Semua critical smoke case harus PASS sebelum manual regression dimulai. Jika satu critical case FAIL atau BLOCKED, hentikan siklus final regression dan klasifikasikan build belum siap sampai blocker ditangani. Jangan isi status aktual di portal.</p>
      <div className="content-card session7-table-card"><div className="session7-table-wrap">
        <table className="session7-table"><caption>Final smoke guidance</caption><thead><tr><th scope="col">Case</th><th scope="col">Langkah</th><th scope="col">Expected result</th></tr></thead>
          <tbody>{smokeCases.map(([id, action, expected]) => <tr key={id}><th scope="row"><code>{id}</code></th><td>{action}</td><td>{expected}</td></tr>)}</tbody>
        </table>
      </div></div>
      <p className="session7-gate"><strong>Gate:</strong> semua critical smoke PASS → simpan evidence lalu jalankan <code>npm run seed</code> sebelum manual regression. FAIL atau BLOCKED → stop dan investigasi.</p>
    </Section>

    <Section number="05 · MANUAL REGRESSION" title="Jalankan skenario regression dengan baseline terkendali">
      <p className="session7-section-intro">Reseed sebelum setiap kasus independen yang memerlukan stok awal 10. Untuk REG-F-05, seed satu kali, lakukan inbound 5 lalu outbound 3, dan periksa hasil akhir. Catat actual result dan evidence Anda.</p>
      <div className="content-card session7-table-card"><div className="session7-table-wrap">
        <table className="session7-table"><caption>Manual regression guidance</caption><thead><tr><th scope="col">Case</th><th scope="col">Skenario</th><th scope="col">Expected result</th></tr></thead>
          <tbody>{regressionCases.map(([id, scenario, expected]) => <tr key={id}><th scope="row"><code>{id}</code></th><td>{scenario}</td><td>{expected}</td></tr>)}</tbody>
        </table>
      </div></div>
      <article className="content-card session7-card session7-failure-note">
        <h3>Failure injection pada REG-F-07</h3>
        <p>Jalankan skenario normal dan setiap mode dari baseline seed yang terpisah. Mode yang tersedia: <code>stocktaking-write</code> dan <code>item-update</code>. Tujuan pembelajaran adalah memeriksa apakah kegagalan mencegah false success serta state Firestore parsial. Cocokkan runtime message dengan dokumen aktual; panduan ini tidak menyatakan hasil run mahasiswa.</p>
      </article>
    </Section>

    <Section number="06 · SELECTED AUTOMATION" title="Gunakan automation sebagai bagian dari evidence">
      <article className="content-card session7-card">
        <p>Jalankan <code>npm run regression</code>. Suite terpilih mencakup stock boundaries, product validation, stocktaking arithmetic, dan record consistency. Automation melengkapi manual regression, bukan menggantikannya.</p>
        <p>Jika suite gagal, jangan menghapus test atau mengubah expected output hanya agar hasilnya hijau. Investigasi apakah masalah berasal dari production rule, baseline, atau expected oracle, lalu catat command, output, totals aktual, dan evidence.</p>
        <p className="session7-callout"><strong>Catatan:</strong> hasil runtime instruktur tidak ditampilkan sebagai hasil mahasiswa. Jalankan suite pada build Anda dan rekam hasil aktual.</p>
      </article>
    </Section>

    <Section number="07 · FINAL RTM" title="Tautkan requirement dan risk ke evidence yang mendukung">
      <p className="session7-section-intro">Final RTM menghubungkan evidence S3, S5, S6, dan S7. Referensi historis membantu pencarian, tetapi tidak menggantikan pemeriksaan evidence. Kolom evidence kosong tidak sama dengan PASS; status hanya PASS jika evidence yang dirujuk benar-benar mendukung requirement.</p>
      <div className="content-card session7-table-card"><div className="session7-table-wrap">
        <table className="session7-table"><caption>Required Final RTM rows</caption><thead><tr><th scope="col">Requirement / risk</th><th scope="col">Focus</th><th scope="col">Sumber evidence untuk dipertimbangkan</th></tr></thead><tbody>
          <tr><th scope="row"><code>REQ-STK-01</code></th><td>Inbound valid memperbarui stok secara konsisten.</td><td>S3/S5/S6/S7</td></tr>
          <tr><th scope="row"><code>REQ-STK-03</code></th><td>Outbound tidak menurunkan stok di bawah nol.</td><td>S3/S5/S6/S7</td></tr>
          <tr><th scope="row"><code>REQ-STK-04</code></th><td>Movement invalid atau nol ditolak tanpa mutasi.</td><td>S3/S5/S6/S7</td></tr>
          <tr><th scope="row"><code>REQ-HIS-01</code></th><td>Record menyimpan operation, amount, dan nilai sebelum/sesudah.</td><td>S5/S6/S7</td></tr>
          <tr><th scope="row"><code>REQ-HIS-02</code></th><td>History merujuk record transaksi yang tersimpan.</td><td>S5/S6/S7</td></tr>
          <tr><th scope="row">Product validation</th><td>Field dan nilai produk yang wajib divalidasi.</td><td>S3/S7</td></tr>
          <tr><th scope="row">Partial-write / false-success</th><td>Failure tidak meninggalkan data parsial atau pesan sukses palsu.</td><td>S5/S6/S7</td></tr>
          <tr><th scope="row">Acceptance critical flow</th><td>Critical use case release akhir berjalan end-to-end.</td><td>S6/S7</td></tr>
        </tbody></table>
      </div></div>
    </Section>

    <Section number="08 · DEFECT & RESIDUAL RISK" title="Nilai defect dan risiko dengan retest evidence">
      <div className="session7-grid session7-two-columns">
        <article className="content-card session7-card"><h3>Item untuk direview</h3><ul>
          <li><code>BUG-S3-01</code> — product validation.</li>
          <li><code>BUG-S5-01</code> — partial write / false success.</li>
          <li>Defect baru yang ditemukan pada S7.</li>
          <li>Dependency sales/customer yang berada di luar scope.</li>
        </ul><p>Jangan menandai BUG-S3-01 atau BUG-S5-01 fixed tanpa retest evidence.</p></article>
        <article className="content-card session7-card"><h3>Field review</h3><p>Pertimbangkan severity, impact, status, evidence, release disposition, mitigation, dan owner. Untuk residual risk, jelaskan dasar penilaian dan tindakan berikutnya. Template tidak menentukan closure atau disposition mahasiswa.</p></article>
      </div>
    </Section>

    <Section number="09 · RELEASE READINESS" title="Tentukan blocker dan recommendation dari evidence">
      <div className="session7-grid session7-two-columns">
        <article className="content-card session7-card"><h3>Contoh release blocker</h3><ul>
          <li>Critical stock-integrity regression gagal.</li>
          <li>Current stock tidak cocok dengan history atau transaksi.</li>
          <li>Failure menghasilkan false success.</li>
          <li>Critical acceptance criterion S6 belum ditutup.</li>
          <li>High residual risk tidak memiliki mitigation atau owner yang jelas.</li>
        </ul><p>Masalah visual minor non-transaksional dengan workaround dapat menjadi release condition, bukan otomatis blocker. Klasifikasi temuan berdasarkan evidence dan konteksnya.</p></article>
        <article className="content-card session7-card"><h3>Metrik Final Test Summary</h3><ul>
          <li>Build ID.</li><li>Final Smoke PASS / total.</li><li>Manual Regression PASS / total.</li>
          <li>Automated Regression result.</li><li>Open Critical/High Defects.</li><li>Highest Residual Risk.</li><li>RTM Coverage.</li><li>Final Recommendation.</li>
        </ul><p className="session7-callout">Pilihan recommendation: RECOMMENDED, RECOMMENDED WITH CONDITIONS, atau NOT RECOMMENDED YET. Portal tidak memilihkan satu. Persentase PASS tinggi tidak mengesampingkan satu critical failure.</p></article>
      </div>
      <article className="content-card session7-card session7-recommendation">
        <h3>Struktur Final Tester Recommendation</h3>
        <ol><li><strong>Final Recommendation</strong></li><li><strong>Evidence basis:</strong> final smoke, manual regression, automated regression, critical RTM status, open defects, dan residual risk.</li><li><strong>Conditions / blockers</strong></li><li><strong>Next action:</strong> release, pilot with conditions, atau fix and retest.</li></ol>
        <p>Tulis recommendation setelah evidence ditinjau. Bagian ini adalah struktur kosong, bukan keputusan yang sudah dibuat.</p>
      </article>
    </Section>

    <Section number="10 · STUDENT OUTPUTS & DOWNLOADS" title="Lengkapi tujuh output praktikum">
      <div className="content-card session7-table-card session7-output-card"><div className="session7-table-wrap">
        <table className="session7-table"><caption>Output mahasiswa dan template pendukung</caption><thead><tr><th scope="col">#</th><th scope="col">Output</th><th scope="col">Template</th></tr></thead><tbody>
          {outputs.map(([output, template], index) => <tr key={output}><th scope="row">{index + 1}</th><td>{output}</td><td><code>{template}</code></td></tr>)}
        </tbody></table>
      </div></div>
      <p className="session7-section-intro">Template disediakan sebagai file CSV atau Markdown yang dapat diedit. Isi actual results dan keputusan sendiri; ID, expected outcomes, headings, serta requirement/risk rows hanya memberi struktur.</p>
      <div className="content-card session7-card">
        <ul className="session7-template-list">{templates.map((template) => <li key={template.file}>
          <a href={`/downloads/session-7-templates/${template.file}`} download aria-label={`Unduh template ${template.name} (${template.format})`}>{template.name}<span aria-hidden="true">↓</span></a>
          <small>{template.format}</small>
        </li>)}</ul>
      </div>
    </Section>

    <Section number="11 · PRIOR-SESSION EVIDENCE FALLBACK" title="Gunakan instructor baseline hanya bila evidence lama tidak tersedia">
      <article className="content-card session7-card session7-instructor-note">
        <p><strong>INSTRUCTOR BASELINE / REFERENCE EVIDENCE</strong> menyediakan referensi terbatas untuk mahasiswa yang tidak memiliki evidence S3/S5/S6 yang dapat digunakan. Evidence milik mahasiswa tetap diutamakan. Setiap item diberi stable reference ID dan menjelaskan batas klaimnya.</p>
        <p>Paket ini bukan student evidence, tidak melaporkan eksekusi mahasiswa, tidak mengisi Final RTM, dan tidak berisi S7 execution atau final recommendation.</p>
        <a className="session7-evidence-link" href="/downloads/session-7-evidence/Instructor_Evidence_Package.md" download>Unduh Instructor Evidence Package <span aria-hidden="true">↓</span></a>
      </article>
    </Section>

    <aside className="session7-security-note" aria-label="Batas keamanan classroom build">
      <strong>Local emulator boundary</strong>
      <p>Session 7 hanya menggunakan demo project dan Firestore Emulator lokal. Jangan gunakan production credentials, mengekspos emulator ke jaringan publik, atau deploy classroom Firestore rules ke production. Instruksi ini untuk classroom build terunduh, bukan untuk cara hosting portal.</p>
    </aside>
  </div>
}

