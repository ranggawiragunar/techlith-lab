import './style.css'
import { usageProfile, usageProfileTotal } from './usageProfile'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) throw new Error('The classroom reference page requires an #app element.')

app.innerHTML = `
  <main class="shell">
    <header class="hero">
      <span class="eyebrow">TECHLITH LAB · SOFTWARE TESTING</span>
      <h1>Verification &amp; Validation — Session 3 Reference Source</h1>
      <p>Reference classroom rule set untuk latihan source-level testing. Mahasiswa membuat test sendiri di folder <code>tests/</code>.</p>
    </header>
    <section class="notice" aria-label="Environment boundary">
      <strong>Environment boundary</strong>
      <p>Isolated Session 3 source adalah reference classroom rule set yang selaras dengan canonical requirements. Source ini bukan snapshot byte-for-byte dari Main Techlith Lab application.</p>
      <p>Observation Session 1 pada Main Application tidak menentukan behavior reference source ini. Reference outbound mengikuti requirement: quantity tidak boleh melebihi current stock.</p>
    </section>
    <div class="columns">
      <section class="card">
        <span class="eyebrow">OPERATIONAL PROFILE</span>
        <h2>Classroom usage profile</h2>
        <table><thead><tr><th>Activity</th><th>Frequency</th></tr></thead><tbody>
          ${usageProfile.map(({ activity, frequencyPercent }) => `<tr><td>${activity}</td><td>${frequencyPercent}%</td></tr>`).join('')}
        </tbody><tfoot><tr><th>Total profile</th><th>${usageProfileTotal()}%</th></tr></tfoot></table>
        <p class="muted">Classroom operational profile untuk prioritization; bukan production telemetry.</p>
      </section>
      <section class="card">
        <span class="eyebrow">STATE MODEL</span>
        <h2>Item state</h2>
        <p><code>ACTIVE</code> → archive → <code>ARCHIVED</code></p>
        <p><code>ARCHIVED</code> → restore → <code>ACTIVE</code></p>
        <p class="muted">Model berada di memori dan dapat diuji melalui API kecil di source.</p>
      </section>
    </div>
    <footer>Techlith Lab · Verification &amp; Validation · Session 3</footer>
  </main>
`
