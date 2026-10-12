# Techlith Lab Inventory — Session 7 Final QA Pack Workspace

Use this workspace to assemble your **Final Software Testing Document** and **Final QA Pack** from work and evidence you actually produced in Sessions 1–6. These files are structures for your report, not completed answers. Keep every result, interpretation, defect detail, conclusion, and recommendation supported by a source you can identify.

## Carry-forward map

- **Session 1:** testing focus, objective, level, initial evidence, and priority.
- **Session 2:** requirement-to-technique mapping, EP/BVA, experience-based ideas, and candidate tests `TC-INV-001`–`TC-INV-006`.
- **Session 3:** code-based, fault-based, usage-based, and model-based evidence, plus your practical record.
- **Session 4:** normalized classroom evidence and your strategy/metrics interpretation. The normalized reference values are not your Session 5 measurements.
- **Session 5:** your improved suite, scoped before/after coverage, controlled mutation results, work products, reusable assets, and state-transition evidence.
- **Session 6:** your execution records, observed RC1/RC2 evidence, investigation, defect report, retest, regression, mini RTM, and test summary.

Use evidence you personally hold or can retrieve. Do not copy a classroom reference or an instructor result into an `Actual` field as though you ran it.

## Files

1. `software-testing-document.md` — report structure and prompts.
2. `requirement-traceability-matrix.csv` — six canonical requirement rows with optional, clearly labeled reference hints.
3. `test-register.csv` — orientation IDs; fill design and observed execution fields from your records.
4. `evidence-index.csv` — add only real artifacts, logs, screenshots, or command output.
5. `metrics-summary.csv` — normalized Session 4 classroom references are separated from student-owned observations.
6. `defect-register.csv` — blank except for the permitted Session 6 orientation ID.
7. `retest-regression-summary.csv` — blank student execution record.
8. `presentation-outline.md` — prompts for a concise 6–10 slide presentation.
9. `submission-checklist.md` — completeness, consistency, evidence, and branding self-review.

## Traceability and evidence rules

Keep canonical prefixes: `REQ-INV-`, `TC-INV-`, `DEF-INV-`, `EV-INV-`, and `MET-INV-`. Trace requirement → test → evidence → defect (when one is supported) → retest/regression. Keep expected and actual separate. A test result is evidence; an interpretation or conclusion is a separate claim that should cite evidence and state its limits.

Session 4's 88% statement, 72% branch, and 50% mutation values are **normalized classroom evidence**. They do not represent a student's Session 5 run. Record Session 5 metrics from your own run and include source, command, scope, and limitation. Session 6 RC, retest, and regression results must likewise come from your observed execution evidence.

For archived-state coverage, include ARCHIVED rejection and review restore → ACTIVE, history persistence/availability, and cross-state behavior evidence. Do not summarize this only as “archived untested.”

## No prefilled final answer

The templates do not contain a completed report, actual result, defect title/severity/root cause, final conclusion, or recommendation. Fill those fields only after checking your evidence. Session 7 is a documentation practicum; it adds no test runner, backend, database, or new release candidate.
