import { useState } from 'react'

const requirementChoices = [
  ['REQ-INV-001', 'Quantity > 0'],
  ['REQ-INV-002', 'Quantity ≤ current stock / exact-stock'],
  ['REQ-INV-003', 'Whole-number unit'],
  ['REQ-INV-004', 'Fractional precision'],
  ['REQ-INV-005', 'Archived item'],
  ['REQ-INV-006', 'Stock History consistency'],
] as const

const techniqueChoices = [
  'Objective-driven / requirement-based',
  'Equivalence Partitioning',
  'Boundary Value Analysis',
  'Experience-based / exploratory',
  'Error guessing',
  'Combination',
] as const

const mappingFocus = requirementChoices.map(([requirement, focus]) => ({ requirement, focus }))
const candidateIds = Array.from({ length: 6 }, (_, index) => `TC-INV-${String(index + 1).padStart(3, '0')}`)
const boundaryValues = ['0', '1', '2', '9', '10', '11']

interface MappingRow {
  objective: string
  technique: string
  reason: string
}

interface ExperienceRow {
  focus: string
  sequence: string
  risk: string
  expected: string
  evidence: string
}

interface CandidateRow {
  requirement: string
  technique: string
  data: string
  expected: string
  evidence: string
  reason: string
}

function blankMapping(): MappingRow {
  return { objective: '', technique: '', reason: '' }
}

function blankExperience(): ExperienceRow {
  return { focus: '', sequence: '', risk: '', expected: '', evidence: '' }
}

function blankCandidate(): CandidateRow {
  return { requirement: '', technique: '', data: '', expected: '', evidence: '', reason: '' }
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`
}

function TextField({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return (
    <label className="s2-field">
      <span>{label}</span>
      {multiline
        ? <textarea rows={2} value={value} onChange={(event) => onChange(event.target.value)} />
        : <input value={value} onChange={(event) => onChange(event.target.value)} />}
    </label>
  )
}

function RequirementSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="s2-field">
      <span>Requirement ID</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Pilih requirement</option>
        {requirementChoices.map(([id, focus]) => <option key={id} value={id}>{id} · {focus}</option>)}
      </select>
    </label>
  )
}

function TechniqueSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="s2-field">
      <span>Technique selected</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Pilih technique</option>
        {techniqueChoices.map((technique) => <option key={technique}>{technique}</option>)}
      </select>
    </label>
  )
}

export function Session2Worksheet() {
  const [mapping, setMapping] = useState<MappingRow[]>(mappingFocus.map(blankMapping))
  const [valueClassifications, setValueClassifications] = useState<string[]>(boundaryValues.map(() => ''))
  const [fractionalExample, setFractionalExample] = useState('')
  const [experience, setExperience] = useState<ExperienceRow[]>(Array.from({ length: 3 }, blankExperience))
  const [candidates, setCandidates] = useState<CandidateRow[]>(candidateIds.map(blankCandidate))

  function updateMapping(index: number, key: keyof MappingRow, value: string) {
    setMapping((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row))
  }

  function updateExperience(index: number, key: keyof ExperienceRow, value: string) {
    setExperience((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row))
  }

  function updateCandidate(index: number, key: keyof CandidateRow, value: string) {
    setCandidates((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row))
  }

  function downloadWorksheet() {
    const headers = ['Section', 'ID', 'Requirement ID', 'Focus', 'Testing objective', 'Technique', 'Test data / precondition', 'Student response / expected result', 'Evidence to capture', 'Reason / risk']
    const lines: string[][] = [headers]
    mappingFocus.forEach((focus, index) => lines.push(['Task 1 · Objective and technique', '', focus.requirement, focus.focus, mapping[index].objective, mapping[index].technique, '', '', '', mapping[index].reason]))
    boundaryValues.forEach((value, index) => lines.push(['Task 2 · EP/BVA', '', 'REQ-INV-002 / REQ-INV-003', `BRG-005 · ${value} pcs`, '', 'Boundary Value Analysis', value, valueClassifications[index], '', '']))
    lines.push(['Task 2 · EP/BVA', '', 'REQ-INV-003', 'BRG-005 · pcs', '', 'Equivalence Partitioning', fractionalExample, '', '', 'Fractional input candidate and classification'])
    experience.forEach((row, index) => lines.push(['Task 3 · Experience-based', `Idea ${index + 1}`, '', row.focus, '', 'Experience-based / exploratory', row.sequence, row.expected, row.evidence, row.risk]))
    candidates.forEach((row, index) => lines.push(['Task 4 · Candidate test case', candidateIds[index], row.requirement, '', '', row.technique, row.data, row.expected, row.evidence, row.reason]))
    const csv = lines.map((line) => line.map(csvCell).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'session-2-test-design-worksheet.csv'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="s2-worksheet-stack">
      <section className="content-card s2-panel" aria-labelledby="s2-task1-title">
        <div className="s2-section-head"><div><div className="eyebrow">TASK 1 · OBJECTIVE &amp; TECHNIQUE</div><h2 id="s2-task1-title">Hubungkan requirement dengan rancangan</h2></div></div>
        <p className="s2-muted">Area fokus disediakan sebagai titik awal. Rumuskan objective, pilih technique, lalu tulis alasan Anda. Pilihan technique tidak diisi otomatis.</p>
        <div className="s2-mapping-list">
          {mappingFocus.map((focus, index) => (
            <fieldset className="s2-mapping-row" key={focus.requirement}>
              <legend><code>{focus.requirement}</code> · {focus.focus}</legend>
              <div className="s2-fields-grid">
                <TextField label="Testing objective" value={mapping[index].objective} onChange={(value) => updateMapping(index, 'objective', value)} multiline />
                <TechniqueSelect value={mapping[index].technique} onChange={(value) => updateMapping(index, 'technique', value)} />
                <TextField label="Reason" value={mapping[index].reason} onChange={(value) => updateMapping(index, 'reason', value)} multiline />
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <section className="content-card s2-panel" aria-labelledby="s2-task2-title">
        <div className="s2-section-head"><div><div className="eyebrow">TASK 2 · EQUIVALENCE PARTITIONING &amp; BOUNDARY VALUE ANALYSIS</div><h2 id="s2-task2-title">Turunkan partisi dan nilai batas</h2></div></div>
        <p className="s2-muted">Setelah menyiapkan baseline, gunakan BRG-005 (unit pcs, current stock 10). Klasifikasikan nilai berikut dan jelaskan alasan Anda; candidate value bukan hasil pengujian.</p>
        <div className="s2-boundary-grid">
          {boundaryValues.map((value, index) => <TextField key={value} label={`${value} pcs · klasifikasi / alasan`} value={valueClassifications[index]} onChange={(classification) => setValueClassifications((current) => current.map((item, itemIndex) => itemIndex === index ? classification : item))} />)}
        </div>
        <TextField label="Contoh input pecahan untuk domain pcs dan alasan klasifikasinya" value={fractionalExample} onChange={setFractionalExample} />
        <p className="s2-prompt">Pertimbangkan partisi valid dan invalid, batas bawah quantity positif, batas atas current stock, exact-stock, serta perbedaan unit bilangan bulat dan fractional. Untuk nilai over-stock, turunkan expected result dari requirement.</p>
      </section>

      <section className="content-card s2-panel" aria-labelledby="s2-task3-title">
        <div className="s2-section-head"><div><div className="eyebrow">TASK 3 · EXPERIENCE-BASED TESTING</div><h2 id="s2-task3-title">Catat ide eksplorasi</h2></div></div>
        <p className="s2-muted">Tuliskan sedikitnya tiga ide dari sudut pandang penggunaan dan risiko. Semua kolom dimulai kosong.</p>
        <div className="s2-experience-grid">
          {experience.map((row, index) => (
            <fieldset className="s2-experience-row" key={index}>
              <legend>Idea {index + 1}</legend>
              <TextField label="Exploratory focus" value={row.focus} onChange={(value) => updateExperience(index, 'focus', value)} />
              <TextField label="User action / sequence" value={row.sequence} onChange={(value) => updateExperience(index, 'sequence', value)} multiline />
              <TextField label="Risk / error guess" value={row.risk} onChange={(value) => updateExperience(index, 'risk', value)} multiline />
              <TextField label="Expected behavior from requirement" value={row.expected} onChange={(value) => updateExperience(index, 'expected', value)} multiline />
              <TextField label="Reason / evidence to capture" value={row.evidence} onChange={(value) => updateExperience(index, 'evidence', value)} multiline />
            </fieldset>
          ))}
        </div>
      </section>

      <section className="content-card s2-panel" aria-labelledby="s2-task4-title">
        <div className="s2-section-head"><div><div className="eyebrow">TASK 4 · TEST DESIGN CANDIDATES</div><h2 id="s2-task4-title">Rancang enam candidate test case</h2></div><span className="session-count">6 initial cases</span></div>
        <p className="s2-muted">Rancang enam kasus yang secara keseluruhan mencakup quantity 0, exact-stock, over-stock, quantity pecahan pada pcs, precision unit meter, dan archived item. Sertakan pemeriksaan Stock History pada setidaknya satu kasus yang berhasil. Expected result ditulis berdasarkan requirement.</p>
        <div className="s2-candidate-list">
          {candidates.map((row, index) => (
            <fieldset className="s2-candidate-row" key={candidateIds[index]}>
              <legend><code>{candidateIds[index]}</code></legend>
              <div className="s2-fields-grid">
                <RequirementSelect value={row.requirement} onChange={(value) => updateCandidate(index, 'requirement', value)} />
                <TechniqueSelect value={row.technique} onChange={(value) => updateCandidate(index, 'technique', value)} />
                <TextField label="Test data / precondition" value={row.data} onChange={(value) => updateCandidate(index, 'data', value)} multiline />
                <TextField label="Expected result" value={row.expected} onChange={(value) => updateCandidate(index, 'expected', value)} multiline />
                <TextField label="Evidence to capture" value={row.evidence} onChange={(value) => updateCandidate(index, 'evidence', value)} multiline />
                <TextField label="Reason / risk" value={row.reason} onChange={(value) => updateCandidate(index, 'reason', value)} multiline />
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <section className="content-card s2-panel s2-export-panel" aria-labelledby="s2-export-title">
        <div><div className="eyebrow">WORKSHEET · CARRY-FORWARD</div><h2 id="s2-export-title">Simpan rancangan Anda</h2><p className="s2-muted">Isian tersimpan sementara di halaman ini dan akan hilang setelah reload. Unduh hasil kerja sebelum menutup halaman.</p></div>
        <button className="button button-primary" type="button" onClick={downloadWorksheet}>Download worksheet berisi isian</button>
        <a className="session-template-link" href="/downloads/verification-validation/session-2-test-design-worksheet.csv" download>Unduh template CSV kosong →</a>
      </section>
    </div>
  )
}
