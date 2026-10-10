import { Link } from 'react-router-dom'

const setupSteps = [
  'Download the classroom ZIP.',
  'Extract the ZIP to a folder on your computer.',
  'Open a terminal in the extracted project folder.',
  'Install the project dependencies.',
  'Start the local classroom application.',
  'Run the automated test suite.',
]

export function Session3SourcePage() {
  return (
    <>
      <div className="page-heading session3-page-heading">
        <div>
          <div className="eyebrow">SESSION 3 · SOURCE AND AUTOMATION</div>
          <h1>Source Code &amp; Automation</h1>
          <p>Download the classroom project to inspect its source and run the application and tests on your computer.</p>
        </div>
        <a className="button button-primary" href="/downloads/session-3-inventory-classroom.zip" download>
          Download Classroom Source
        </a>
      </div>

      <section className="content-card session3-source-card">
        <h2>Run the project locally</h2>
        <ol className="session3-source-steps">
          {setupSteps.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <div className="session3-source-commands" aria-label="Local project commands">
          <div><span>Install dependencies</span><code>npm install</code></div>
          <div><span>Start the application</span><code>npm start</code></div>
          <div><span>Run automated tests</span><code>npm test -- --watchAll=false</code></div>
        </div>
      </section>

      <div className="session3-source-grid">
        <section className="content-card session3-source-card">
          <h2>Source investigation</h2>
          <p>Inspect the project files and compare the stated requirements with the behavior you observe. Record your test inputs, steps, and actual results.</p>
          <p>Make source changes only in your extracted local project. Local edits do not modify the hosted Techlith Lab.</p>
        </section>
        <section className="content-card session3-source-card">
          <h2>Automated testing and retest</h2>
          <p>Run the test suite and review its output. After your own source changes, rerun the tests and repeat relevant manual scenarios to check for regressions.</p>
          <p>The local classroom project uses its own in-memory data. It is separate from the hosted inventory, stock history, reports, and testing utilities.</p>
        </section>
      </div>

      <Link className="session3-source-back" to="/admin/classroom/session-3">← Back to Session 3 classroom</Link>
    </>
  )
}
