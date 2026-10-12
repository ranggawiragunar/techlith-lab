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

Session 4 remains planned; this project contains no later evidence pack, coverage target, mutation outcome, or instructor conclusion.
