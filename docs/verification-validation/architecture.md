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
