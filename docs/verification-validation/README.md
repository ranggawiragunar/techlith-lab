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
