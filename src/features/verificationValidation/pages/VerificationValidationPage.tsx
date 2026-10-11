import { verificationValidationCourse, type SessionStatus } from '../courseConfig'

function getSessionStatusLabel(status: SessionStatus) {
  return status === 'available' ? 'Available' : 'Coming later'
}

export function VerificationValidationPage() {
  const course = verificationValidationCourse

  return (
    <section className="verification-course" aria-labelledby="verification-course-title">
      <div className="page-heading verification-course-heading">
        <div>
          <div className="eyebrow">CLASSROOM · TECHLITH LAB INVENTORY</div>
          <h1 id="verification-course-title">{course.title}</h1>
          <p>Running case: <strong>{course.caseName}</strong></p>
        </div>
        <span className="pill">7 sessions</span>
      </div>

      <div className="content-card verification-course-intro">
        <span className="verification-course-mark" aria-hidden="true">✓</span>
        <div>
          <h2>Course overview</h2>
          <p>
            Pelajari verifikasi dan validasi melalui rangkaian sasaran dan rancangan pengujian,
            teknik kode, fault, usage, dan model, pembacaan test metrics, proses pengujian,
            hingga dokumentasi hasil pengujian.
          </p>
        </div>
      </div>

      <div className="verification-session-heading">
        <div>
          <div className="eyebrow">COURSE ROADMAP</div>
          <h2>Session roadmap</h2>
        </div>
        <span>Context 00 · Foundation</span>
      </div>

      <ol className="verification-session-list">
        {course.sessions.map((session) => (
          <li className="content-card verification-session-card" key={session.number}>
            <span className="verification-session-number" aria-hidden="true">
              {String(session.number).padStart(2, '0')}
            </span>
            <div className="verification-session-copy">
              <div className="verification-session-meta">
                <span>{session.deliveryModel}</span>
                <span className="verification-session-status">{getSessionStatusLabel(session.status)}</span>
              </div>
              <h3>{session.title}</h3>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
