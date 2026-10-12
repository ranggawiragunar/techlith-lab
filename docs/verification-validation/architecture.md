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

The Session 3 route is `/admin/classroom/verification-validation/session-3`; Session 1–3 routes are explicit, while Sessions 4–7 remain planned and unlinked. The student starter source of truth is `classroom/verification-validation/session-3-source/`, with a downloadable archive at `public/downloads/verification-validation/session-3-source.zip` and evidence template at `public/downloads/verification-validation/session-3-practical-record.csv`.

Session 3's reference classroom rule set is aligned with canonical requirements but is not a byte-for-byte snapshot of the Main Application. It uses standalone TypeScript/Vite/Vitest/V8 coverage dependencies from its own package manifest and lockfile; root dependencies and inventory services are untouched. Student-authored tests live in its `tests/` directory. Controlled variants M01–M04, the classroom operational profile, and an in-memory ACTIVE/ARCHIVED state model support fault, usage, and model-based work. Coverage is feedback only, and no later-session outcome is stored in student-facing content.
