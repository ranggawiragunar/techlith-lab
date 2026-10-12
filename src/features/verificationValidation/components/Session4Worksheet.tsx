import { useState } from 'react'

const metricDefinitions = [
  { metric: 'Statement Coverage', observedValue: '88%' },
  { metric: 'Branch Coverage', observedValue: '72%' },
  { metric: 'Mutation Score', observedValue: '50%' },
] as const

const techniques = [
  'Code-based',
  'Fault-based',
  'Usage-based',
  'Model-based',
  'Objective / requirement-based',
  'Experience-based',
  'Input-domain / EP / BVA',
] as const

interface MetricResponse {
  tells: string
  doesNotProve: string
  question: string
}

interface TechniqueResponse {
  area: string
  primary: string
  supporting: string
  traceability: string
  reason: string
  evidence: string
}

interface PriorityResponse {
  candidate: string
  risk: string
  frequency: string
  gap: string
  priority: string
  reason: string
}

interface ImprovementResponse {
  target: string
  action: string
  signal: string
  traceability: string
  notes: string
}

const exportHeaders = [
  'Section', 'Row ID', 'Metric', 'Observed Value', 'What it tells us', 'What it does NOT prove', 'Question / evidence needed',
  'Area / Gap', 'Primary Technique', 'Supporting Technique', 'Requirement / Mutant / Model', 'Reason', 'Evidence to collect',
  'Improvement Candidate', 'Risk', 'Usage Frequency', 'Evidence Gap', 'Priority', 'Action ID', 'Target',
  'Test / Evidence Action', 'Expected Signal', 'Traceability', 'Owner Notes',
]

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`
}

function WorksheetField({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return (
    <label className="s4-field">
      <span>{label}</span>
      {multiline
        ? <textarea rows={2} value={value} onChange={(event) => onChange(event.target.value)} />
        : <input value={value} onChange={(event) => onChange(event.target.value)} />}
    </label>
  )
}

function TechniqueSelect({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="s4-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Pilih teknik</option>
        {techniques.map((technique) => <option key={technique}>{technique}</option>)}
      </select>
    </label>
  )
}

function blankTechnique(): TechniqueResponse {
  return { area: '', primary: '', supporting: '', traceability: '', reason: '', evidence: '' }
}

function blankPriority(): PriorityResponse {
  return { candidate: '', risk: '', frequency: '', gap: '', priority: '', reason: '' }
}

function blankImprovement(): ImprovementResponse {
  return { target: '', action: '', signal: '', traceability: '', notes: '' }
}

export function Session4Worksheet() {
  const [metricResponses, setMetricResponses] = useState<MetricResponse[]>(metricDefinitions.map(() => ({ tells: '', doesNotProve: '', question: '' })))
  const [techniqueRows, setTechniqueRows] = useState<TechniqueResponse[]>(Array.from({ length: 4 }, blankTechnique))
  const [priorityRows, setPriorityRows] = useState<PriorityResponse[]>(Array.from({ length: 4 }, blankPriority))
  const [improvementRows, setImprovementRows] = useState<ImprovementResponse[]>(Array.from({ length: 4 }, blankImprovement))

  function updateMetric(index: number, key: keyof MetricResponse, value: string) {
    setMetricResponses((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row))
  }

  function updateTechnique(index: number, key: keyof TechniqueResponse, value: string) {
    setTechniqueRows((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row))
  }

  function updatePriority(index: number, key: keyof PriorityResponse, value: string) {
    setPriorityRows((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row))
  }

  function updateImprovement(index: number, key: keyof ImprovementResponse, value: string) {
    setImprovementRows((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row))
  }

  function downloadWorksheet() {
    const lines: string[][] = [exportHeaders]
    metricDefinitions.forEach(({ metric, observedValue }, index) => {
      lines.push(['A · Metric interpretation', `METRIC-${index + 1}`, metric, observedValue, metricResponses[index].tells, metricResponses[index].doesNotProve, metricResponses[index].question, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    })
    techniqueRows.forEach((row, index) => {
      lines.push(['B · Technique combination', `COMBO-${String(index + 1).padStart(2, '0')}`, '', '', '', '', '', row.area, row.primary, row.supporting, row.traceability, row.reason, row.evidence, '', '', '', '', '', '', '', '', '', '', ''])
    })
    priorityRows.forEach((row, index) => {
      lines.push(['C · Priority decision', `PRIORITY-${String(index + 1).padStart(2, '0')}`, '', '', '', '', '', '', '', '', '', row.reason, '', row.candidate, row.risk, row.frequency, row.gap, row.priority, '', '', '', '', '', ''])
    })
    improvementRows.forEach((row, index) => {
      lines.push(['D · Improvement plan', `PLAN-${String(index + 1).padStart(2, '0')}`, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', `IMP-${String(index + 1).padStart(2, '0')}`, row.target, row.action, row.signal, row.traceability, row.notes])
    })
    const csv = lines.map((line) => line.map(csvCell).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'session-4-strategy-metrics-worksheet.csv'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <section className="s4-worksheet content-card" aria-labelledby="s4-worksheet-title">
      <div className="s4-section-heading">
        <div><div className="eyebrow">WORKSHEET · IN-MEMORY</div><h2 id="s4-worksheet-title">Catat interpretasi dan rencana Anda</h2></div>
        <button className="button button-primary" type="button" onClick={downloadWorksheet}>Download worksheet berisi isian</button>
      </div>
      <p className="s4-muted">Isian hanya disimpan di halaman ini dan akan hilang saat reload. Unduh sebelum meninggalkan halaman. Nilai evidence pack sudah disediakan; interpretasi, prioritas, dan action tetap Anda rumuskan.</p>

      <section className="s4-worksheet-section" aria-labelledby="s4-metric-worksheet-title">
        <h3 id="s4-metric-worksheet-title">A. Metric interpretation</h3>
        <div className="s4-worksheet-rows">
          {metricDefinitions.map(({ metric, observedValue }, index) => (
            <fieldset className="s4-worksheet-row" key={metric}>
              <legend>{metric} · {observedValue}</legend>
              <div className="s4-fields-grid">
                <WorksheetField label="What it tells us" value={metricResponses[index].tells} onChange={(value) => updateMetric(index, 'tells', value)} multiline />
                <WorksheetField label="What it does NOT prove" value={metricResponses[index].doesNotProve} onChange={(value) => updateMetric(index, 'doesNotProve', value)} multiline />
                <WorksheetField label="Question / evidence needed" value={metricResponses[index].question} onChange={(value) => updateMetric(index, 'question', value)} multiline />
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <section className="s4-worksheet-section" aria-labelledby="s4-combination-worksheet-title">
        <h3 id="s4-combination-worksheet-title">B. Technique combination</h3>
        <div className="s4-worksheet-rows">
          {techniqueRows.map((row, index) => (
            <fieldset className="s4-worksheet-row" key={index}>
              <legend>Combination {index + 1}</legend>
              <div className="s4-fields-grid">
                <WorksheetField label="Area / Gap" value={row.area} onChange={(value) => updateTechnique(index, 'area', value)} />
                <TechniqueSelect label="Primary Technique" value={row.primary} onChange={(value) => updateTechnique(index, 'primary', value)} />
                <TechniqueSelect label="Supporting Technique" value={row.supporting} onChange={(value) => updateTechnique(index, 'supporting', value)} />
                <WorksheetField label="Requirement / Mutant / Model" value={row.traceability} onChange={(value) => updateTechnique(index, 'traceability', value)} />
                <WorksheetField label="Reason" value={row.reason} onChange={(value) => updateTechnique(index, 'reason', value)} multiline />
                <WorksheetField label="Evidence to collect" value={row.evidence} onChange={(value) => updateTechnique(index, 'evidence', value)} multiline />
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <section className="s4-worksheet-section" aria-labelledby="s4-priority-worksheet-title">
        <h3 id="s4-priority-worksheet-title">C. Priority decision</h3>
        <div className="s4-worksheet-rows">
          {priorityRows.map((row, index) => (
            <fieldset className="s4-worksheet-row" key={index}>
              <legend>Priority candidate {index + 1}</legend>
              <div className="s4-fields-grid">
                <WorksheetField label="Improvement Candidate" value={row.candidate} onChange={(value) => updatePriority(index, 'candidate', value)} />
                <WorksheetField label="Risk" value={row.risk} onChange={(value) => updatePriority(index, 'risk', value)} />
                <WorksheetField label="Usage Frequency" value={row.frequency} onChange={(value) => updatePriority(index, 'frequency', value)} />
                <WorksheetField label="Evidence Gap" value={row.gap} onChange={(value) => updatePriority(index, 'gap', value)} />
                <WorksheetField label="Priority" value={row.priority} onChange={(value) => updatePriority(index, 'priority', value)} />
                <WorksheetField label="Reason" value={row.reason} onChange={(value) => updatePriority(index, 'reason', value)} multiline />
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <section className="s4-worksheet-section" aria-labelledby="s4-plan-worksheet-title">
        <h3 id="s4-plan-worksheet-title">D. Improvement plan</h3>
        <div className="s4-worksheet-rows">
          {improvementRows.map((row, index) => (
            <fieldset className="s4-worksheet-row" key={index}>
              <legend>IMP-{String(index + 1).padStart(2, '0')}</legend>
              <div className="s4-fields-grid">
                <WorksheetField label="Target" value={row.target} onChange={(value) => updateImprovement(index, 'target', value)} />
                <WorksheetField label="Test / Evidence Action" value={row.action} onChange={(value) => updateImprovement(index, 'action', value)} multiline />
                <WorksheetField label="Expected Signal" value={row.signal} onChange={(value) => updateImprovement(index, 'signal', value)} multiline />
                <WorksheetField label="Traceability" value={row.traceability} onChange={(value) => updateImprovement(index, 'traceability', value)} />
                <WorksheetField label="Owner Notes" value={row.notes} onChange={(value) => updateImprovement(index, 'notes', value)} multiline />
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <a className="s4-download-link" href="/downloads/verification-validation/session-4-strategy-metrics-worksheet.csv" download>Download blank worksheet CSV →</a>
    </section>
  )
}
