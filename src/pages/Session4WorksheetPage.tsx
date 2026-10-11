import { useState } from 'react'

const topics = [
  'State & Invariant',
  'Sequence Testing',
  'Collaboration Testing',
  'Inheritance & Polymorphism',
  'Stub, Mock & Dependency Isolation',
]

const questionGroups = [
  {
    title: 'Soal 1 — State dan Invariant',
    scenario: <p>Object <code>InventoryItem</code> memiliki <code>currentStock = 10</code>. Admin melakukan outbound dengan <code>amount = 10</code>.</p>,
    questions: [
      { id: 'state-before-after', label: 'Pertanyaan A', prompt: 'State apa saja yang perlu diamati sebelum dan sesudah method/process outbound dijalankan?' },
      { id: 'state-invariant', label: 'Pertanyaan B', prompt: 'Invariant apa yang harus tetap benar setelah transaksi selesai?' },
      { id: 'state-failure', label: 'Pertanyaan C', prompt: 'Kapan test dianggap gagal walaupun UI menampilkan pesan sukses?' },
    ],
  },
  {
    title: 'Soal 2 — Sequence Testing',
    scenario: (
      <div>
        <p>Ikuti urutan aksi berikut dan tentukan final state berdasarkan aturan domain yang Anda pahami.</p>
        <ol className="session4-sequence" aria-label="Urutan aksi inventory">
          <li><span>Start</span><code>stock = 10</code></li>
          <li><span>Aksi 1</span><code>Inbound 5</code></li>
          <li><span>Aksi 2</span><code>Outbound 3</code></li>
          <li><span>Aksi 3</span><code>Outbound 12</code></li>
          <li><span>Final State?</span></li>
        </ol>
      </div>
    ),
    questions: [
      { id: 'sequence-first-actions', label: 'Pertanyaan A', prompt: 'Hitung expected stock setelah Inbound 5 dan Outbound 3.' },
      { id: 'sequence-outbound-12', label: 'Pertanyaan B', prompt: 'Apa expected result saat Outbound 12 dijalankan setelah stock menjadi 12?' },
      { id: 'sequence-history', label: 'Pertanyaan C', prompt: 'Apa yang harus dicek pada history agar sequence tidak hanya benar di UI?' },
    ],
  },
  {
    title: 'Soal 3 — Collaboration Testing',
    scenario: (
      <div>
        <p>Skenario domain konseptual: satu aksi stocktaking dapat berhubungan dengan beberapa bagian sistem. Alur berikut hanya untuk pembelajaran; Techlith Lab saat ini tidak memiliki Stocktaking Form terpisah.</p>
        <ol className="session4-flow" aria-label="Alur konseptual stocktaking">
          {['Stocktaking Form', 'Item Stock', 'History', 'Report', 'Evidence'].map((step, index) => (
            <li key={step}>
              <span>{step}</span>
              {index < 4 && <span className="session4-flow-arrow" aria-hidden="true">→</span>}
            </li>
          ))}
        </ol>
      </div>
    ),
    questions: [
      { id: 'collaboration-changes', label: 'Pertanyaan A', prompt: 'Jika outbound berhasil, bagian mana saja yang harus berubah?' },
      { id: 'collaboration-history-risk', label: 'Pertanyaan B', prompt: 'Apa risiko jika item stock berubah tetapi history tidak tercatat?' },
      { id: 'collaboration-assertion', label: 'Pertanyaan C', prompt: 'Assertion apa yang perlu ditulis untuk menguji collaboration ini?' },
    ],
  },
  {
    title: 'Soal 4 — Inheritance dan Polymorphism',
    scenario: (
      <div>
        <p>Bayangkan transaksi inventory dimodelkan dengan hierarchy konseptual berikut. Ini bukan representasi arsitektur React Techlith Lab.</p>
        <ul className="session4-hierarchy" aria-label="Hierarchy transaksi konseptual">
          <li><code>StockTransaction</code>
            <ul>
              <li><code>InboundTransaction</code></li>
              <li><code>OutboundTransaction</code></li>
            </ul>
          </li>
        </ul>
      </div>
    ),
    questions: [
      { id: 'inheritance-polymorphic-method', label: 'Pertanyaan A', prompt: 'Method apa yang mungkin dipolymorphic? Misalnya calculateNextStock().' },
      { id: 'inheritance-shared-tests', label: 'Pertanyaan B', prompt: 'Apa test yang harus sama untuk semua subclass?' },
      { id: 'inheritance-outbound-tests', label: 'Pertanyaan C', prompt: 'Apa test khusus untuk OutboundTransaction?' },
    ],
  },
  {
    title: 'Soal 5 — Stub, Mock, dan Isolasi Dependency',
    scenario: (
      <div>
        <p>Pada aplikasi nyata, object dapat berinteraksi dengan dependency eksternal.</p>
        <div className="session4-dependency-columns">
          <div>
            <h3>Contoh hipotetis untuk pembelajaran</h3>
            <ul>
              <li>Firestore write</li>
              <li>Storage delete/upload</li>
              <li>Router navigation</li>
              <li>Notification/toast</li>
              <li>Global state</li>
            </ul>
            <p>Firestore dan Storage di atas adalah contoh hipotetis, bukan dependency Techlith Lab.</p>
          </div>
          <div>
            <h3>Dependency Techlith Lab saat ini</h3>
            <ul>
              <li>Browser-local IndexedDB</li>
              <li>Dexie</li>
              <li>React Router</li>
              <li>React state</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    questions: [
      { id: 'dependencies-unit-mock', label: 'Pertanyaan A', prompt: 'Bagian mana yang sebaiknya di-stub atau di-mock saat unit/component test?' },
      { id: 'dependencies-integration', label: 'Pertanyaan B', prompt: 'Bagian mana yang sebaiknya diuji sebagai integration test, bukan unit test?' },
      { id: 'dependencies-overmocking', label: 'Pertanyaan C', prompt: 'Apa risiko test yang terlalu banyak memakai mock?' },
      { id: 'dependencies-no-mock', label: 'Pertanyaan D', prompt: 'Apa risiko test yang tidak memakai mock sama sekali?' },
    ],
  },
] as const

const answerIds = questionGroups.flatMap((group) => group.questions.map((question) => question.id))

export function Session4WorksheetPage() {
  const [answers, setAnswers] = useState<Record<string, string>>(() => Object.fromEntries(answerIds.map((id) => [id, ''])))

  function updateAnswer(id: string, value: string) {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [id]: value }))
  }

  return (
    <div className="session4-worksheet">
      <div className="page-heading session4-page-heading">
        <div>
          <div className="eyebrow">CLASSROOM LABS · SESSION 4</div>
          <h1>Session 4 — Object-Oriented Testing</h1>
          <p className="session4-subtitle">Memahami Object-Oriented Testing melalui Domain Inventory</p>
        </div>
        <button className="button button-primary session4-print-button" type="button" onClick={() => window.print()}>
          Cetak Worksheet
        </button>
      </div>

      <section className="content-card session4-intro-card" aria-labelledby="session4-intro-title">
        <div className="session4-session-details">
          <div><span>Metode pembelajaran</span><strong>Soal-Jawab Terstruktur</strong></div>
          <div><span>Durasi</span><strong>±30 menit</strong></div>
        </div>
        <div className="session4-intro-copy">
          <h2 id="session4-intro-title">Tentang sesi ini</h2>
          <p>
            Analisis konsep pengujian berorientasi objek melalui model domain Inventory yang bersifat konseptual.
            Kegiatan ini bukan praktikum coding dan tidak memerlukan perubahan source code. Siapkan lembar kerja
            jawaban singkat untuk mencatat analisis Anda.
          </p>
          <p className="session4-answer-warning">
            Jawaban hanya tersimpan sementara di halaman ini dan akan hilang saat halaman dimuat ulang atau ditinggalkan.
            Cetak worksheet atau pilih Save as PDF sebelum me-refresh atau keluar.
          </p>
        </div>
      </section>

      <section className="session4-topics-section" aria-labelledby="session4-topics-title">
        <div className="session4-topics-heading">
          <div>
            <h2 id="session4-topics-title">Lima topik pembelajaran</h2>
            <p>Gunakan daftar ini sebagai panduan untuk kegiatan soal-jawab.</p>
          </div>
        </div>
        <ol className="session4-topic-list">
          {topics.map((topic) => <li key={topic}><h3>{topic}</h3></li>)}
        </ol>
      </section>

      <div className="session4-question-list">
        {questionGroups.map((group, groupIndex) => (
          <section className="content-card session4-question-group" aria-labelledby={`session4-group-${groupIndex + 1}`} key={group.title}>
            <h2 id={`session4-group-${groupIndex + 1}`} className="session4-group-title">{group.title}</h2>
            <div className="session4-scenario">
              <h3>Skenario</h3>
              {group.scenario}
            </div>
            <div className="session4-questions">
              {group.questions.map((question) => (
                <div className="session4-question" key={question.id}>
                  <label htmlFor={`session4-answer-${question.id}`}>
                    <span>{question.label}</span>
                    <span>{question.prompt}</span>
                  </label>
                  <textarea
                    id={`session4-answer-${question.id}`}
                    name={question.id}
                    rows={4}
                    value={answers[question.id]}
                    onChange={(event) => updateAnswer(question.id, event.target.value)}
                  />
                  <div className="session4-print-answer" aria-hidden="true">{answers[question.id]}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
