import { useState } from 'react'

interface WorksheetRow {
  focus: string
  requirement: string
  objective: string
  level: string
  evidence: string
  priority: string
  reason: string
}

const columns: Array<{ key: keyof WorksheetRow; label: string }> = [
  { key: 'focus', label: 'Evidence / Fokus' },
  { key: 'requirement', label: 'Requirement terkait' },
  { key: 'objective', label: 'Objective' },
  { key: 'level', label: 'Level utama' },
  { key: 'evidence', label: 'Evidence lanjutan' },
  { key: 'priority', label: 'Prioritas' },
  { key: 'reason', label: 'Alasan singkat' },
]

function emptyRow(): WorksheetRow {
  return { focus: '', requirement: '', objective: '', level: '', evidence: '', priority: '', reason: '' }
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`
}

export function SessionWorksheet() {
  const [rows, setRows] = useState<WorksheetRow[]>([emptyRow(), emptyRow(), emptyRow()])

  function updateRow(index: number, key: keyof WorksheetRow, value: string) {
    setRows((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row))
  }

  function downloadWorksheet() {
    const csv = [columns.map(({ label }) => label), ...rows.map((row) => columns.map(({ key }) => row[key]))]
      .map((line) => line.map(csvCell).join(','))
      .join('\r\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'session-1-objective-level-worksheet.csv'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <section className="content-card session-worksheet" aria-labelledby="worksheet-title">
      <div className="session-section-heading">
        <div><div className="eyebrow">LEMBAR KERJA</div><h2 id="worksheet-title">Initial testing analysis</h2></div>
        <button className="button button-primary" type="button" onClick={downloadWorksheet}>Download worksheet</button>
      </div>
      <p className="session-muted">Isi sedikitnya tiga baris. Jawaban tersimpan sementara di halaman ini dan akan hilang saat halaman dimuat ulang.</p>
      <div className="worksheet-rows">
        {rows.map((row, index) => (
          <fieldset className="worksheet-row" key={index}>
            <legend>Analisis {index + 1}</legend>
            <div className="worksheet-fields">
              {columns.map(({ key, label }) => (
                <label className={`worksheet-field worksheet-field-${key}`} key={key}>
                  <span>{label}</span>
                  {key === 'level' ? (
                    <select value={row[key]} onChange={(event) => updateRow(index, key, event.target.value)}>
                      <option value="">Pilih level</option><option>Unit Testing</option><option>Integration Testing</option><option>System Testing</option>
                    </select>
                  ) : key === 'priority' ? (
                    <select value={row[key]} onChange={(event) => updateRow(index, key, event.target.value)}>
                      <option value="">Pilih prioritas</option><option>Tinggi</option><option>Sedang</option><option>Rendah</option>
                    </select>
                  ) : key === 'objective' || key === 'evidence' || key === 'reason' ? (
                    <textarea rows={2} value={row[key]} onChange={(event) => updateRow(index, key, event.target.value)} />
                  ) : (
                    <input value={row[key]} onChange={(event) => updateRow(index, key, event.target.value)} />
                  )}
                </label>
              ))}
            </div>
            {rows.length > 3 && <button className="worksheet-remove" type="button" onClick={() => setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))} aria-label={`Hapus analisis ${index + 1}`}>Hapus baris</button>}
          </fieldset>
        ))}
      </div>
      <button className="button button-quiet worksheet-add" type="button" onClick={() => setRows((current) => [...current, emptyRow()])}>＋ Tambah baris analisis</button>
    </section>
  )
}
