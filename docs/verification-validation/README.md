# Verification & Validation Classroom Track

This course track introduces software verification and validation through the Techlith Lab Inventory case. Implementation is delivered incrementally, beginning with Context 00 and continuing through Sessions 1–7.

- **Branch:** `verification-validation`
- **Classroom route:** `/admin/classroom/verification-validation`
- **Main Application:** the existing local-first inventory laboratory, used for early black-box and manual work.
- **Classroom Portal:** course instructions, worksheets, navigation, and downloads.
- **Isolated Classroom Source:** independent projects for practical sessions that need their own deterministic setup.

The portal reveals only the session title, delivery model, and implementation status until each session is introduced. Do not add future answers or instructor-only conclusions to the student-facing application.

Do not merge this branch with `software-testing` as an implementation shortcut.

## Session 1

- **Route:** `/admin/classroom/verification-validation/session-1`
- **Delivery:** Mini Case, approximately 30 minutes.
- **System Under Test:** the Main Techlith Lab Inventory application, used from the student perspective.
- **Student references:** requirements `REQ-INV-001`–`REQ-INV-006` and observations `EV-INV-001`–`EV-INV-005`.
- **Worksheet:** an in-memory analysis worksheet with CSV export; blank template at `public/downloads/verification-validation/session-1-objective-level-worksheet.csv`.
- **Progressive disclosure:** Session 1 supports black-box/manual reasoning. It does not present source code, root-cause analysis, or instructor conclusions.
- **Carry-forward:** students bring their selected focus, requirement, objective, primary test level, evidence needs, and priority into the detailed test-case design work in Session 2.

## Session 2

- **Route:** `/admin/classroom/verification-validation/session-2`
- **Delivery:** Mini Case, approximately 30 minutes; uses the Main Techlith Lab Inventory through its existing user-facing routes.
- **Classroom baseline:** the page action restores the normal local seed and prepares `BRG-005` (`pcs`) with stock 10 and empty movement history. Permanent seed values are unchanged; the current admin session is preserved.
- **Student references:** canonical requirements `REQ-INV-001`–`REQ-INV-006` and six editable candidate IDs `TC-INV-001`–`TC-INV-006`.
- **Worksheet:** in-memory objective/technique mapping, EP/BVA classifications, experience ideas, and candidate test design; blank template at `public/downloads/verification-validation/session-2-test-design-worksheet.csv`.
- **Progressive disclosure:** design remains black-box and user-facing. Expected results are reasoned from requirements; the page does not expose implementation details, answer keys, or later-session results.
- **Carry-forward:** requirement/objective/technique mapping, EP/BVA reasoning, experience-based ideas, six candidate cases, and their requirement-based expected results prepare students for Session 3.

## Session 3

- **Route:** `/admin/classroom/verification-validation/session-3`
- **Delivery:** Praktikum — source-level testing of code, controlled faults, usage, and a state model.
- **Environment boundary:** `classroom/verification-validation/session-3-source/` is an isolated reference classroom rule set aligned with canonical requirements. It is not a byte-for-byte snapshot of the Main Techlith Lab application. Reference outbound behavior follows REQ-INV-002; it does not reproduce the Main Application observation from Session 1 and is not described as a “fixed version of the bug.”
- **Tooling:** standalone Node.js LTS, npm, TypeScript, Vite, Vitest, and V8 coverage. Its dependencies and lockfile are isolated; root package manifests are unchanged.
- **Student workflow:** students author tests under `tests/` for code-based, fault-based, usage-based, and model-based reasoning. Session 2 candidates are carry-forward inputs, not mandatory one-to-one unit tests.
- **Materials:** downloadable starter at `public/downloads/verification-validation/session-3-source.zip`; practical evidence template at `public/downloads/verification-validation/session-3-practical-record.csv`.
- **Source topics:** controlled mutants M01–M04, the classroom operational profile, and the in-memory ACTIVE/ARCHIVED model. No mutant outcome, normalized metric target, or later-session evidence is included.
- **Progressive disclosure:** coverage is feedback only in Session 3. Session 4 interprets a separate normalized classroom evidence pack.

## Session 4

- **Route:** `/admin/classroom/verification-validation/session-4`
- **Delivery:** Mini Case — memilih kombinasi teknik, membaca metrics, menetapkan prioritas, dan menyusun improvement plan.
- **Normalized evidence:** shared classroom dataset dengan statement coverage 88%, branch coverage 72%, mutation score 50%, 2/4 mutants killed, dan 2/4 survived. Angka tersebut menormalisasi bahan diskusi dan tidak menyatakan bahwa semua mahasiswa mendapat output sama dari Session 3.
- **Mutants:** M01 KILLED, M02 SURVIVED, M03 KILLED, M04 SURVIVED dalam dataset kelas. Status menjadi evidence untuk interpretasi, bukan verdict kualitas keseluruhan.
- **Operational profile:** 35/25/25/10/5 untuk View Inventory, Stock Inbound, Stock Outbound, Stock History, dan Archive / Restore; classroom operational profile, bukan production telemetry.
- **State transition:** ARCHIVED rejection telah diverifikasi. Remaining evidence gap meliputi restore → ACTIVE, history persistence/availability, dan behavior lintas state setelah archive/restore; gap tersebut belum otomatis merupakan defect.
- **Materials:** in-memory strategy/metrics worksheet di halaman Session 4; blank template dan normalized evidence pack di `public/downloads/verification-validation/`.
- **Boundary:** tidak ada testing engine baru, perubahan source Session 3, atau perubahan Main Application. Worksheet menyiapkan test/evidence improvement plan untuk dievaluasi pada Session 5 tanpa memuat hasil sesi berikutnya.

## Session 5

Session 5 is available at `/admin/classroom/verification-validation/session-5`. Its isolated source is `classroom/verification-validation/session-5-source/`, derived from the Session 3 reference rules and explicitly not a byte-for-byte Main Application snapshot. The official baseline suite is designed for 88% scoped statement, 72% scoped branch, and 50% mutation (M01/M03 killed; M02/M04 survived). V8 supplies raw and machine-readable coverage; the standalone scoped calculation documents its source scope. Students add tests toward 100%/100%/4-of-4, using blank work products and evidence for state-transition gaps. The Session 6 carry-forward is generic. No Main Application behavior or root dependency changes are part of this session.

## Session 6

Session 6 is available at `/admin/classroom/verification-validation/session-6`, with isolated source at `classroom/verification-validation/session-6-source/` and student materials under `public/downloads/verification-validation/`. The student workflow executes RC1 before reviewing RC2, then records failure evidence, creates a traceable defect report, retests, runs regression, and summarizes. Six requirement-based scenarios use REQ-INV-001–006. Student-facing materials do not reveal the pre-execution outcome or root cause. All release behavior and tooling are isolated; Main Application and root dependencies remain unchanged.

## Session 7

Session 7 is available at `/admin/classroom/verification-validation/session-7`. The documentation-only workspace is `classroom/verification-validation/session-7-workspace/`; the student download is `public/downloads/verification-validation/session-7-final-qa-pack.zip`. It integrates Session 1–6 student work into a Final Software Testing Document and Final QA Pack. Templates preserve canonical REQ/TC/DEF/EV/MET identifiers and leave student-owned actuals and conclusions blank. Session 4 metrics are labeled normalized classroom references; Session 5/6 actuals must come from student evidence. No new execution engine, backend, or root dependency is added. Sessions 1–7 are available, completing the track flow from test objectives through final documentation and presentation.
