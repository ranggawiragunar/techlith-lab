# Verification & Validation Classroom Sources

Standalone classroom projects for the Techlith Lab Verification & Validation track live under this directory. Each practical source project has its own package manifest and lockfile; the root application dependency set stays independent.

## Session 3

- **Status:** Available · Praktikum
- **Portal route:** `/admin/classroom/verification-validation/session-3`
- **Source of truth:** `session-3-source/`
- **Student download:** `public/downloads/verification-validation/session-3-source.zip`
- **Evidence template:** `public/downloads/verification-validation/session-3-practical-record.csv`

Session 3 uses an isolated reference classroom rule set aligned with canonical requirements. It is not a byte-for-byte snapshot of the Main Techlith Lab application. Students install the standalone project with `npm ci`, author tests under `tests/`, then use Vitest and V8 coverage as feedback. Tooling dependencies remain in the standalone manifest and lockfile, not the root application.

The source includes controlled fault variants M01–M04, a classroom operational profile, and an in-memory ACTIVE/ARCHIVED state model. Students carry requirement-to-technique mapping, EP/BVA reasoning, exploratory ideas, six candidate cases, and requirement-derived expected results from Session 2 into their source-level work. Candidate cases can inform tests without requiring one-to-one translation.

## Session 4

- **Status:** Available · Mini Case
- **Portal route:** `/admin/classroom/verification-validation/session-4`
- **Normalized dataset:** `public/downloads/verification-validation/session-4-normalized-evidence-pack.csv`
- **Worksheet template:** `public/downloads/verification-validation/session-4-strategy-metrics-worksheet.csv`

Session 4 interprets a normalized classroom evidence pack separate from Session 3 student test output. The page includes the metrics and controlled-mutant status for this mini case, the classroom operational profile, and the verified ARCHIVED rejection plus remaining restore/history/cross-state evidence gaps. It adds no runner and does not alter the standalone Session 3 source.

## Session 5

- **Status:** Available · Praktikum
- **Portal route:** `/admin/classroom/verification-validation/session-5`
- **Isolated source:** `classroom/verification-validation/session-5-source/`
- **Student downloads:** `public/downloads/verification-validation/session-5-source.zip` and `session-5-work-products.zip`

Session 5 is derived from the canonical Session 3 reference rules; it remains an isolated classroom environment and is not a byte-for-byte Main Application snapshot. Its official baseline suite is intentionally incomplete. Actual V8 data supports documented scoped baseline metrics of 88% statements and 72% branches, and the deterministic Vitest mutation harness produces 50%: M01/M03 KILLED and M02/M04 SURVIVED. Students add tests to explore coverage, exact-stock and decimal-precision distinctions, and restore/history/cross-state evidence. The acceptance target is 100%/100%/4-of-4, not a prefilled student result.

The standalone source contains no answer suite. It bundles blank planning, design, execution, metrics, findings, evidence, and reusable-asset work products. Root dependencies, Main Application business behavior, permanent seed, Session 3 source, and Session 4 evidence pack are unchanged. Student work carries forward generically to Session 6.
