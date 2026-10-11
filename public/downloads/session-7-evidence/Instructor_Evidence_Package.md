# Instructor Evidence Package — Prior-Session Reference

> **INSTRUCTOR BASELINE / REFERENCE EVIDENCE**  
> This package is an instructor-supplied historical reference for students who do not have usable prior S3/S5/S6 evidence. Student-owned evidence is preferred. These references do not represent a student's execution, do not close a student's defect, and do not determine a student's RTM status or Session 7 recommendation.

Use the reference IDs below only to identify prior-session baseline material when building the Final RTM. Inspect the cited source artifacts and collect current Session 7 evidence separately. No Session 7 execution result is included here.

## IE-S3-01 — Product validation teaching baseline

- **Session:** 3
- **Topic / risk:** Required product-field validation; historical traceability ID `BUG-S3-01`.
- **Evidence type:** Instructor baseline / reference to existing source and automated test material.
- **What this establishes:** The original Session 3 implementation intentionally retains the product-validation teaching defect. Existing Session 3 automated source/test material documents rejection of an incomplete product.
- **What this does not establish:** It is not a student's test run or screenshot; it does not establish that a later build has the same behavior, that the defect is fixed, or that `BUG-S3-01` is closed. Retest evidence is required for any closure claim.
- **Suggested RTM relevance:** Product validation; use as historical S3 context, then cite the student's applicable retest evidence for a current status.
- **Source artifact / reference:** `classroom/session-3-source/src/inventoryRules.js`; `classroom/session-3-source/src/inventoryRules.test.js`; original Session 3 implementation intentionally unchanged.

## IE-S5-01 — Baseline Flow integration teaching baseline

- **Session:** 5
- **Topic / risk:** Partial write and false-success teaching behavior; historical traceability ID `BUG-S5-01`.
- **Evidence type:** Instructor baseline / reference to the isolated Session 5 classroom source and its documented flows.
- **What this establishes:** Session 5 Baseline Flow contains the intentional partial-write / false-success teaching behavior, and a Reference Safe Flow exists separately. Session 5 source remains intentionally unchanged.
- **What this does not establish:** It is not a student's integration execution, does not state the outcome of a student's run, and does not establish that `BUG-S5-01` is fixed or closed. Closure requires relevant retest evidence.
- **Suggested RTM relevance:** Partial-write / false-success risk; use as prior-session context and connect it to S6/S7 evidence that actually supports the final status.
- **Source artifact / reference:** `classroom/session-5-source/README.md`; `classroom/session-5-source/src/services/stocktaking.ts`; isolated Baseline Flow and Reference Safe Flow documentation/source.

## IE-S6-01 — Stable release-candidate baseline

- **Session:** 6
- **Topic / risk:** Acceptance and implementation-readiness baseline for inventory integrity and transaction failure handling.
- **Evidence type:** Instructor development / baseline verification from the approved Session 6 verification; not student execution.
- **What this establishes:** The approved instructor verification established stable RC behavior for the baseline data, critical smoke flow, valid inbound/outbound, outbound equal to available stock, rejection of outbound above stock, atomic failure handling, and no false success in the Session 6 stable RC.
- **What this does not establish:** It does not report a student's Session 6 or Session 7 execution, replace evidence from the student's target build, or decide whether current S7 requirements pass. Recheck the current build and cite the student's own evidence where available.
- **Suggested RTM relevance:** `REQ-STK-01`, `REQ-STK-03`, `REQ-HIS-01`, `REQ-HIS-02`, partial-write / false-success, and acceptance critical flow; treat this only as prior S6 instructor context.
- **Source artifact / reference:** Approved Session 6 instructor verification baseline; `classroom/session-6-source/README.md` and the Session 6 classroom source package. Verification scope is the prior S6 stable RC, not the student's Session 7 run.

## Use in the Final RTM

If a student's own prior evidence is unavailable, cite the relevant `IE-S3-01`, `IE-S5-01`, or `IE-S6-01` reference in the corresponding historical evidence column and identify it as instructor baseline/reference evidence. Keep actual S7 evidence, final status, defect closure, residual-risk disposition, and recommendation under the student's control. A reference alone does not automatically make a requirement PASS.
