import { Link } from 'react-router-dom'
import { verificationValidationRoutes } from '../routes'

const carryForward = [
  ['Session 1 · Mini Case', 'Testing focus, objective, level, initial evidence, and priority.'],
  ['Session 2 · Mini Case', 'Requirement-to-technique mapping, EP/BVA, experience-based ideas, and TC-INV-001–TC-INV-006.'],
  ['Session 3 · Praktikum', 'Code-based, fault-based, usage-based, and model-based evidence with practical record.'],
  ['Session 4 · Mini Case', 'Normalized classroom evidence and strategy/metrics interpretation. Keep references separate from your actual run.'],
  ['Session 5 · Praktikum', 'Your improved suite, scoped coverage/mutation before and after, reusable assets, and state-transition evidence.'],
  ['Session 6 · Praktikum', 'Your execution evidence, investigation, defect, retest, regression, mini RTM, and test summary.'],
]
const packParts = ['Software Testing Document', 'Requirement Traceability Matrix (RTM)', 'Test Case / Scenario Register', 'Evidence Index', 'Metrics Summary', 'Defect Register', 'Retest & Regression Summary', 'Test Summary / Conclusion', 'Presentation Outline', 'Submission Checklist']
const selfReview = [
  'Gather work products and evidence from Sessions 1–6.',
  'Normalize REQ / TC / DEF / EV / MET identifiers.',
  'Build the RTM from requirements through tests and evidence.',
  'Summarize metrics while separating normalized references from actual student runs.',
  'Integrate defects with observed failure, fix, retest, and regression evidence.',
  'Write a conclusion supported by the evidence.',
  'State limitations and residual risk without overclaiming.',
  'Prepare a presentation using decision-relevant evidence.',
  'Run the submission checklist and resolve inconsistencies.',
]

export function VerificationValidationSession7Page() {
  return (
    <section className="s4-page s7-page" aria-labelledby="session7-title">
      <Link className="back-link" to={verificationValidationRoutes.basePath}>← Kembali ke course roadmap</Link>
      <header className="content-card s4-hero"><div className="s4-hero-copy"><div className="eyebrow">SESSION 7 · PRAKTIKUM</div><h1 id="session7-title">Menyusun Software Testing Document dan Ringkasan Presentasi pada Techlith Lab Inventory</h1><p>Integrate your Session 1–6 evidence into a traceable Final Software Testing Document and presentation.</p></div><div className="s4-output"><strong>Final output</strong><span>A reviewed Final QA Pack with linked requirements, tests, evidence, metrics, defects, retest/regression, limitations, and conclusion.</span></div></header>

      <section className="content-card s4-panel"><div className="eyebrow">CARRY-FORWARD · SESSIONS 1–6</div><h2>Gather your own work and evidence</h2><div className="s7-carry-grid">{carryForward.map(([title, detail]) => <article key={title}><h3>{title}</h3><p>{detail}</p></article>)}</div><p>Use work products and results you actually hold. Classroom references can guide interpretation; they are not your actual run unless you executed and recorded that run.</p></section>

      <section className="content-card s4-panel"><div className="eyebrow">FINAL QA PACK</div><h2>Assemble a consistent set of documents</h2><ul className="s7-pack-list">{packParts.map((part) => <li key={part}>{part}</li>)}</ul><a className="s4-download-link" href="/downloads/verification-validation/session-7-final-qa-pack.zip" download>Download Final QA Pack workspace →</a><p className="s4-muted">The download is a blank documentation workspace, not a completed student report or instructor answer pack.</p></section>

      <section className="content-card s4-panel"><div className="eyebrow">DOCUMENT STRUCTURE</div><h2>Build the Software Testing Document</h2><ol className="s7-section-list"><li>Document Control</li><li>System / SUT Overview</li><li>Scope and Objectives</li><li>Canonical Requirements</li><li>Test Strategy</li><li>Test Environment</li><li>Test Design Summary</li><li>Test Execution Summary</li><li>Coverage and Mutation Evidence</li><li>Model / State Evidence</li><li>Defect Summary</li><li>Retest and Regression</li><li>Requirement Traceability</li><li>Evidence Index</li><li>Residual Risk and Limitations</li><li>Conclusion</li><li>Recommendation</li><li>Appendix / References</li></ol></section>

      <section className="content-card s4-panel"><div className="eyebrow">TRACEABILITY</div><h2>Connect claims to their source</h2><p>Maintain this chain where it applies: requirement → test → evidence → defect → retest/regression. Keep IDs consistent across the RTM, registers, report, and slides. Distinguish raw evidence from interpretation and explain gaps.</p></section>

      <section className="content-card s4-panel"><div className="eyebrow">METRICS · NORMALIZED VS ACTUAL</div><h2>Keep reference values in context</h2><p>Session 4's 88% statement, 72% branch, and 50% mutation values are normalized classroom evidence. They are not actual Session 5 student results. Record Session 5 before/after metrics from your own run, including source scope, command, and limitation. Do not prefill a target as an achieved value.</p><p>Use the observed results and evidence you collected for Session 6 release-candidate execution, retest, and regression. Keep an expected outcome separate from an actual observation.</p></section>

      <section className="content-card s4-panel"><div className="eyebrow">DEFECT · RETEST · REGRESSION</div><h2>Integrate only supported findings</h2><p>Link a reproducible observation to its requirement, test, and evidence. Keep root-cause statements, severity, priority, and fix references grounded in the record. Summarize retest and regression from your observed execution; a planned case is not a result.</p></section>

      <section className="content-card s4-panel"><div className="eyebrow">PRESENTATION</div><h2>Turn the evidence into a short briefing</h2><p>Use the outline for approximately 6–10 slides: SUT and scope; requirements and risk; strategy; key test design; coverage, mutation, and model evidence; execution and defect evidence; retest/regression; traceability and residual risk; conclusion/recommendation.</p><ul><li>Use evidence, not decoration; show metric source and context.</li><li>Highlight 2–4 decision-relevant findings.</li><li>Do not make claims without evidence.</li><li>Keep conclusions within scope and state limitations.</li></ul></section>

      <section className="content-card s4-panel"><div className="eyebrow">FINAL SELF-REVIEW</div><h2>Check the pack before submission</h2><ol className="s7-review-list">{selfReview.map((step, index) => <li key={step}><strong>Step {index + 1}</strong><span>{step}</span></li>)}</ol><p>Confirm identifiers, expected/actual fields, metric labels, evidence links, defect references, and file links agree throughout the pack.</p></section>

      <section className="content-card s4-panel"><div className="eyebrow">TROUBLESHOOTING</div><h2>Resolve document consistency issues</h2><ul><li>If an artifact cannot be traced, record the missing source and limitation instead of inventing a reference.</li><li>If a metric differs between sources, identify each scope and method before interpreting it.</li><li>If a test was not executed, label it unexecuted; do not infer PASS/FAIL from expected behavior.</li><li>Use the submission checklist to catch broken links, missing files, and inconsistent identifiers.</li></ul></section>
    </section>
  )
}
