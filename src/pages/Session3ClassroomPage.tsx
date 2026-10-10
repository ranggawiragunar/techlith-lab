import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useClassroomLab } from '../features/session3/context'

const activities: { title: string; description: string; href?: string }[] = [
  {
    title: 'Boundary Testing',
    description: 'Practice manual inventory testing with the isolated classroom dataset.',
    href: '/admin/classroom/session-3/boundary',
  },
  {
    title: 'Product Validation',
    description: 'Explore product input validation through a separate classroom activity.',
    href: '/admin/classroom/session-3/product',
  },
  {
    title: 'Source Code & Automation',
    description: 'Use the separate classroom source project for code investigation and selected automation.',
    href: '/admin/classroom/session-3/source',
  },
]

export function Session3ClassroomPage() {
  const { items, resetLabData } = useClassroomLab()
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [feedback, setFeedback] = useState('')

  function confirmReset() {
    resetLabData()
    setConfirmingReset(false)
    setFeedback('Session 3 lab data has been restored to its baseline.')
  }

  return (
    <>
      <div className="page-heading session3-page-heading">
        <div>
          <div className="eyebrow">CLASSROOM LABS</div>
          <h1>Session 3 — Inventory Testing</h1>
          <p>Practice manual inventory testing, defect investigation, and selected automation using an isolated classroom dataset.</p>
        </div>
        <button className="button button-danger" onClick={() => setConfirmingReset(true)}>Reset Lab Data</button>
      </div>

      {feedback && <div className="success-message page-feedback" role="status">✓ {feedback}<button aria-label="Dismiss message" onClick={() => setFeedback('')}>×</button></div>}

      <section className="classroom-activity-grid" aria-label="Session 3 activities">
        {activities.map((activity) => (
          activity.href ? (
            <Link className="content-card classroom-activity-card classroom-activity-link" to={activity.href} key={activity.title}>
              <div className="eyebrow">SESSION 3 ACTIVITY</div>
              <h2>{activity.title}</h2>
              <p>{activity.description}</p>
              <span className="classroom-activity-action">Open activity <span aria-hidden="true">→</span></span>
            </Link>
          ) : <article className="content-card classroom-activity-card" key={activity.title}>
            <div className="eyebrow">SESSION 3 ACTIVITY</div>
            <h2>{activity.title}</h2>
            <p>{activity.description}</p>
          </article>
        ))}
      </section>

      <section className="content-card classroom-dataset-card">
        <div className="table-toolbar">
          <div>
            <h2>Session 3 Lab Dataset</h2>
            <p>This in-memory classroom data is separate from the main inventory.</p>
          </div>
        </div>
        <div className="classroom-table-wrap">
          <table className="classroom-table">
            <thead>
              <tr>
                <th scope="col">ITEM CODE</th>
                <th scope="col">ITEM NAME</th>
                <th scope="col">CURRENT STOCK</th>
                <th scope="col">UNIT</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.code}>
                  <td className="mono">{item.code}</td>
                  <td>{item.name}</td>
                  <td><strong className="stock-number">{item.stock}</strong></td>
                  <td>{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {confirmingReset && (
        <ConfirmDialog
          title="Reset Session 3 lab data?"
          description="Restore the three classroom items to their starting stock values. Main inventory data and history will not be changed."
          confirmLabel="Reset Lab Data"
          danger
          onCancel={() => setConfirmingReset(false)}
          onConfirm={confirmReset}
        />
      )}
    </>
  )
}
