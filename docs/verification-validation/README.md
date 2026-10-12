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
