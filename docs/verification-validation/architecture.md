# Course Architecture

## Ownership

- `src/features/verificationValidation/` owns course configuration, route constants, and portal UI.
- `classroom/verification-validation/` reserves a home for standalone classroom projects; each project belongs in its own session directory when introduced.
- `docs/verification-validation/` holds course architecture and implementation guidance.
- `public/downloads/verification-validation/` is the public download namespace for student-facing materials.
- The existing `src/` application may change only where needed to register the protected course landing page and its navigation entry. Inventory behavior remains owned by the existing application features and services.

## Naming and status

Use `verification-validation` for the course slug and lowercase kebab-case for directories and download names. Use Techlith Lab naming for course-facing labels and examples. Course configuration keeps session number, title, delivery model, and status together. Sessions start as `planned`; a later context may mark an implemented session `available` without changing the page structure.

## Environment boundaries

The Main Application provides the existing local-first inventory laboratory. The Classroom Portal provides course navigation and materials. Session-specific source code and testing tools belong in isolated classroom sources when required; they must not expand the root dependency surface without a specific foundation need.

Downloads for this course belong under `public/downloads/verification-validation/`. Do not put answer keys or instructor-only conclusions in the public namespace.

## Session 2 baseline boundary

The Session 2 classroom-only preparation helper belongs under `src/features/verificationValidation/services/`. It uses the existing Testing Utilities reset operation, then prepares the existing `BRG-005` whole-number item at stock 10 and leaves movement history empty. This deterministic classroom state does not change permanent seed values or Main Application inventory rules.

## Session 3 isolated source

The Session 3 route is `/admin/classroom/verification-validation/session-3`; Session 1–3 routes are explicit. The student starter source of truth is `classroom/verification-validation/session-3-source/`, with a downloadable archive at `public/downloads/verification-validation/session-3-source.zip` and evidence template at `public/downloads/verification-validation/session-3-practical-record.csv`.

Session 3's reference classroom rule set is aligned with canonical requirements but is not a byte-for-byte snapshot of the Main Application. It uses standalone TypeScript/Vite/Vitest/V8 coverage dependencies from its own package manifest and lockfile; root dependencies and inventory services are untouched. Student-authored tests live in its `tests/` directory. Controlled variants M01–M04, the classroom operational profile, and an in-memory ACTIVE/ARCHIVED state model support fault, usage, and model-based work. Coverage is feedback only, and no later-session outcome is stored in student-facing content.

## Session 4 normalized evidence

Session 4 is available at `/admin/classroom/verification-validation/session-4` as a Mini Case. It reads a separate, deterministic classroom evidence pack: statement coverage 88%, branch coverage 72%, mutation score 50%, 2/4 killed, and 2/4 survived, with M01/M03 KILLED and M02/M04 SURVIVED. These figures are normalized discussion data and do not claim identical Session 3 student results. The page adds no test runner or mutation engine and does not modify the Session 3 source or Main Application.

The Session 4 worksheet and normalized evidence CSV are published under `public/downloads/verification-validation/`. The classroom operational profile stays at 35/25/25/10/5 and is not production telemetry. State evidence records that ARCHIVED rejection is verified; remaining evidence gaps are restore → ACTIVE, historical evidence persistence/availability across archive/restore, and cross-state behavior. These gaps are not labeled defects without supporting evidence. Students carry a traceable improvement plan into Session 5; later-session outcomes stay undisclosed.

## Session 5 isolated evaluation source

Session 5 is available at `/admin/classroom/verification-validation/session-5`. The source of truth is `classroom/verification-validation/session-5-source/`, derived from Session 3 canonical reference rules. It is an isolated classroom project, not a byte-for-byte snapshot of Main Techlith Lab. Its starter suite provides an intentionally incomplete baseline; V8 raw coverage feeds the documented scoped calculation and a deterministic harness runs real Vitest processes for M01–M04. Baseline targets are 88% scoped statement, 72% scoped branch, and 50% mutation (M01/M03 killed; M02/M04 survived); students work toward 100%/100%/4-of-4. Blank work products support planning through reusable assets. Remaining model evidence includes restore, movement after restore, history availability, and cross-state consistency. Session 5 does not change Main App behavior, permanent seed, Session 3 source, Session 4 evidence, or root dependencies.

## Session 6 controlled release-candidate exercise

Session 6 is available at `/admin/classroom/verification-validation/session-6`. Its standalone source is `classroom/verification-validation/session-6-source/`; it has no database or external service. RC1 and RC2 select the same rule code through `TECHLITH_RELEASE`, with one deliberate release-candidate reintroduction of the M03-style whole-number validation fault class. This does not revise Session 3 or Session 5: Session 5 established a strong suite against its reference baseline, and this later candidate can reintroduce a previously known fault class. The exercise trains execution, failure evidence, defect tracking, retest, and regression.

The official suite has six requirement-derived cases. Developer acceptance contract and verified outcomes: RC1 = 6 total, 5 PASS / 1 FAIL; the failing case is TC-INV-S6-002. RC2 = 6/6 PASS. RC2 focused retest = 1/1 PASS. RC2 regression = 5/5 PASS. The fault class is limited to whole-number outbound validation; the remaining canonical cases behave alike across candidates. Defect tracking uses DEF-INV-S6-001 with traceability to REQ-INV-003, TC-INV-S6-002, and EV-INV-S6 evidence. These technical outcomes remain in this instructor-facing architecture document, not student-facing pre-execution material.

Six blank/student-safe work products and two downloadable ZIPs are published under `public/downloads/verification-validation/`. Session 6 evidence and defect workflow carry forward to Session 7's final documentation/presentation activities.

## Session 7 final documentation practicum

Session 7 is available at `/admin/classroom/verification-validation/session-7`; its source of truth is the documentation workspace at `classroom/verification-validation/session-7-workspace/`, packaged as `public/downloads/verification-validation/session-7-final-qa-pack.zip`. It adds no runner, coverage/mutation tool, backend, release candidate, or dependency. The blank Final QA Pack includes the Software Testing Document, RTM, test register, evidence and metrics indexes, defect and retest/regression registers, presentation outline, and submission checklist.

The final workspace preserves canonical `REQ-INV-001`–`REQ-INV-006` and REQ/TC/DEF/EV/MET prefixes. Session 4's 88% statement, 72% branch, and 50% mutation values are labeled normalized classroom evidence; Session 5/6 actual values remain student-owned and require their run evidence. Final defect details, conclusion, and recommendation are not prefilled. The full course flow is S1 objective/level → S2 test design → S3 code/fault/usage/model → S4 strategy/metrics → S5 suite evaluation → S6 execution/defect/retest/regression → S7 final documentation/presentation. Sessions 1–7 are available.
