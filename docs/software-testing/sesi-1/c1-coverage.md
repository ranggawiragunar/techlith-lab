# C1 Coverage Specification

## 1. Purpose

This document maps the Sesi 1 Mini Case (C1) requirements and evidence to the Techlith Lab UI. It is an implementation specification, not a test result or an implementation of C1 behavior. The goal is for students to execute each case, observe business evidence, and determine PASS or FAIL by comparing actual behavior with the stated requirement.

C1 is about testing: requirement, expected result, actual result, evidence, and conclusion. Finding a root cause or inspecting source code is outside the learning target. The app must not disclose a failure label, intentional defect, operator mistake, or debugging explanation.

### Implementation status after Context 5 final QC

The supporting Item CRUD/archive/restore, Stock Inbound, Stock Outbound, atomic movement writes, movement snapshots, and enriched history infrastructure are implemented and manually verified. Final QC verified the UI execution paths and observable evidence for TC-01 through TC-04 and HIS-01 through HIS-03, including reset repeatability and responsive layouts. “COVERED” below means the scenario can be run and inspected; it does not mean every business requirement passes. TC-03 and TC-04 still lead to a student conclusion of FAIL.

## 2. Source Scope

The source for this specification is the supplied Sesi 1 / C1 material:

- Core features: Stock Outbound and Stock History.
- Canonical precondition: `ITM-001` (Kain Katun), current stock `10 meter`.
- Requirements: `REQ-STK-02`, `REQ-STK-03`, `REQ-STK-04`, and `REQ-HIS-02`.
- Cases: `TC-01` through `TC-04`.
- History evidence: `HIS-01` through `HIS-03`.

The coverage status below describes the current Sesi 1 application after final QC. “PARTIAL” means the current schema or page provides some underlying support but a student cannot complete and verify the case through the UI.

## 3. Source Requirements

| ID | Source-derived statement | C1 implication |
|---|---|---|
| `REQ-STK-02` | Stock outbound must be greater than zero. | A zero amount is invalid. C1’s specific observed failure is that Submit remains enabled at zero; the source does not say a zero movement is persisted. |
| `REQ-STK-03` | Stock outbound must not exceed current stock. | An amount greater than available stock is invalid and should be rejected. |
| `REQ-STK-04` | With current stock 10 and outbound 10, the transaction is valid and next stock is 0. | Equality with current stock is allowed. |
| `REQ-HIS-02` | Stocktaking stores `prevAmount`, `amount`, and `nextAmount` consistently. | A movement record must preserve all three values so the student can inspect the calculation. |

## 4. Source Test Cases

Every case starts from the canonical baseline: Admin signed in; `ITM-001` active at 10 meter. The baseline must be restored between cases because each case independently specifies stock 10.

| ID | Input | Expected result from requirement | Behavior/evidence required by C1 | Student conclusion |
|---|---:|---|---|---|
| `TC-01` | Outbound 5 | Accept; stock changes 10 → 5. | Transaction is accepted and item detail shows 5 meter. History can show 10 / 5 / 5. | PASS |
| `TC-02` | Outbound 10 | Accept; stock changes 10 → 0. | Transaction is accepted and item detail shows 0 meter. History can show 10 / 10 / 0. | PASS |
| `TC-03` | Outbound 11 | Reject because 11 exceeds stock 10; stock should remain 10. | The teaching case requires the transaction to be processed and stock to become -1. History can show 10 / 11 / -1. | FAIL |
| `TC-04` | Outbound 0 | Reject because outbound must be greater than zero. | The source explicitly requires Submit to remain enabled at zero. It does not establish that a zero movement is saved. | FAIL |

For TC-04, the agreed product decision is: allow 0 to be entered; keep Submit enabled; if clicked, show “amount must be greater than zero”; do not change stock and do not create a movement. This keeps the required enabled-button observation while avoiding misleading zero-quantity business history. That click outcome is a product decision, not a source observation.

## 5. Coverage Matrix

Each row includes the source type and statement, precondition and role, route/action, required data, expected result, observable behavior/evidence, persistence, tester conclusion, current status/gap, and whether it is source-required or an expansion. “Required route/action” is the future execution path; the current route/action is noted in the status/gap column.

| ID / type / source statement | Canonical precondition / role | Required route / UI action | Required application data | Expected result per requirement | Required Stage-1 observable behavior / student evidence | Required persistence effect | Expected student conclusion | Current C1 status / implementation gap | Origin |
|---|---|---|---|---|---|---|---|---|---|
| `REQ-STK-02` · Requirement · outbound > 0 | `ITM-001` stock 10; Admin | Items → Kain Katun detail → Stock Outbound action; enter amount | Item stock; outbound amount; movement fields | Amount 0 is invalid | Amount 0 remains enterable and Submit remains enabled. After clicking, show feedback; no stock change and no movement (product decision). | Valid positive outbound updates item and writes one movement. Zero writes neither. | N/A as a requirement alone; TC-04 supplies the conclusion | **COVERED** — zero submit remains enabled; the click is validated without changing stock or history. | Source requirement; zero-submit handling is product decision |
| `REQ-STK-03` · Requirement · outbound cannot exceed current stock | `ITM-001` stock 10; Admin | Same item detail outbound action; enter amount | Current stock, amount, movement | Reject amount > stock; stock must not become negative | TC-03 must visibly show stock -1 after the transaction and a movement record with next amount -1, without explaining why. | Item and movement must persist together, including the observed out-of-range result. | N/A as a requirement alone; TC-03 supplies the conclusion | **COVERED** — general positive outbound logic processes over-stock amounts and exposes the resulting negative stock and history. | Source requirement; defect-like observed behavior is specified by TC-03 |
| `REQ-STK-04` · Requirement · stock 10, outbound 10 is valid; next stock 0 | `ITM-001` stock 10; Admin | Same item detail outbound action; submit 10 | Item stock; amount; movement fields | Accept; next stock 0 | Detail shows 0 meter; history exposes 10 / 10 / 0. | Stock 0 and one movement persist. | N/A as a requirement alone; TC-02 supplies PASS | **COVERED** — equality is accepted and history exposes 10 / 10 / 0. | Source requirement |
| `REQ-HIS-02` · Requirement · store `prevAmount`, `amount`, `nextAmount` consistently | A completed outbound; Admin | `/admin/inventory/history`; open the movement record | `StockMovement.prevAmount`, `.amount`, `.nextAmount`, plus item/type/time | Stored values reflect the transaction calculation | History shows the three values together, tied to item and movement type. Students compare them to stock result. | One durable record per accepted outbound; no record for zero by product decision. Stock and movement are committed atomically. | N/A as a requirement alone; HIS-01…03 provide evidence | **COVERED** — history shows all three quantities for each saved outbound, backed by one Dexie transaction. | Source requirement; visible history detail is a supporting UX choice |
| `TC-01` · Test Case · outbound 5 accepted; stock 5 | Stock 10; Admin | Item detail → outbound amount 5 → submit; then detail/history | `ITM-001.stock`; movement 10 / 5 / 5 | Valid; stock 10 → 5 | Success/updated detail shows 5 meter; history row shows prev 10, quantity 5, next 5. No PASS label in app. | Stock and movement persist through navigation and refresh. | PASS | **COVERED** — verified from a reset baseline; movement is 10 / 5 / 5. | Source test case |
| `TC-02` · Test Case · outbound 10 accepted; stock 0 | Stock 10; Admin | Item detail → outbound amount 10 → submit; then detail/history | `ITM-001.stock`; movement 10 / 10 / 0 | Valid; stock 10 → 0 | Detail shows 0 meter and history shows 10 / 10 / 0. | Stock and movement persist through navigation and refresh. | PASS | **COVERED** — verified from a reset baseline; movement is 10 / 10 / 0. | Source test case |
| `TC-03` · Test Case · outbound 11 is processed; stock -1 | Stock 10; Admin | Item detail → outbound amount 11 → submit; then detail/history | `ITM-001.stock`; movement 10 / 11 / -1 | Expected invalid; should be rejected and stock remain 10 | C1 observed behavior must instead show stock -1 and history 10 / 11 / -1. Do not label the row FAIL or explain a defect. | The observed stock and movement persist so the student can inspect them. | FAIL | **COVERED** — verified from reset; generalized behavior also verified on `BRG-002` with 24 / 25 / -1. | Source test case; generalization constraint is an architectural decision |
| `TC-04` · Test Case · outbound 0 invalid; Submit remains enabled | Stock 10; Admin | Item detail → enter 0; inspect Submit; optionally click | Form amount and stock; no movement for zero by product decision | Expected invalid; outbound should not be processed | Submit visibly remains enabled at zero. If clicked, show validation feedback with stock still 10 and no history record (product decision). | No item update and no movement for amount 0. | FAIL based on enabled Submit, not on a persisted zero transaction | **COVERED** — button was enabled; click showed validation, stock remained 10, history remained empty. | Submit-enabled observation is source-required; click feedback/no-write is product decision |
| `HIS-01` · History Evidence · prev 10, amount 5, next 5; consistent with outbound 5 | TC-01 run; Admin | `/admin/inventory/history` → inspect movement | Movement `{prev:10, amount:5, next:5}` | Consistent with a 5-unit outbound | History shows public item code `BRG-001` (source fixture `ITM-001`), outbound type, date/time, prev 10, quantity 5, next 5. | Movement stays visible until reset. | Supports PASS for TC-01 by comparison; history itself has no conclusion label | **COVERED** — verified 10 / 5 / 5 in Recent Movements; history uses the same record. | Source evidence; additional identity/display fields are expansion |
| `HIS-02` · History Evidence · prev 10, amount 10, next 0; consistent with outbound equal to stock | TC-02 run; Admin | `/admin/inventory/history` → inspect movement | Movement `{prev:10, amount:10, next:0}` | Consistent with valid stock exhaustion | History shows 10 / 10 / 0 and links the record to public item code `BRG-001` and outbound. | Movement stays visible until reset. | Supports PASS for TC-02 by comparison; no PASS label in history | **COVERED** — verified 10 / 10 / 0 in Recent Movements; history uses the same record. | Source evidence; additional display detail is expansion |
| `HIS-03` · History Evidence · prev 10, amount 11, next -1; evidence invalid outbound was processed | TC-03 run; Admin | `/admin/inventory/history` → inspect movement | Movement `{prev:10, amount:11, next:-1}` | Inconsistent with REQ-STK-03’s expected rejection | History visibly shows 10 / 11 / -1. Present it as ordinary business history, not as “FAIL”, “bug”, or “intentional”. | Movement and negative resulting stock persist until reset. | Supports FAIL for TC-03 by comparing evidence with REQ-STK-03; no app-generated conclusion | **COVERED** — verified 10 / 11 / -1, including negative stock in detail and history. | Source evidence; neutral presentation is a pedagogical/product constraint |

### Context 5 final QC coverage snapshot

The application supports login, dashboard, item list/detail, stock history, and testing utilities. Item detail provides inbound and outbound actions. Outbound stock updates and movement creation are atomic; history exposes previous, moved, and resulting quantities, item and transaction business codes, actor, source, and notes. Final QC exercised each C1 case independently from the reset baseline.

## 6. UI / Route Gap Analysis

| Route | Current Sesi 1 state | C1 / Stage-1 need |
|---|---|---|
| `/login` | Implemented; normal admin login. | Sufficient. Not a C1 failure scenario. |
| `/admin` and `/admin/dashboard` | Protected; dashboard works. | Sufficient. Dashboard remains a supporting application surface. |
| `/admin/inventory` | Redirects to items. | Sufficient as a route alias. |
| `/admin/inventory/items` | Searchable active/archived inventory list with create, edit, archive, and restore actions. | Normal CRUD is available as a supporting realism feature. |
| `/admin/inventory/items/:itemCode` | Business-code detail route with metadata editing and item-scoped Inbound and Outbound actions. | Outbound is the C1 execution entry point; service operations use internal keys while the UI and URL use public business codes. |
| `/admin/inventory/history` | Filterable history with movement details, quantity evidence, and business context. | C1 quantities and supporting context can be inspected; no PASS/FAIL conclusion is shown. |
| `/admin/testing` | Reset utility with confirmation and feedback. | Final QC confirmed reset restores the seed baseline, clears history, resets the movement sequence, and retains the admin session. |

### Recommended outbound interaction

Put `Stock Inbound` and `Stock Outbound` actions on the item detail page, opening an accessible modal or side drawer scoped to that item. Do not add separate `/inbound` and `/outbound` routes for the first Stage-1 version.

This keeps the current item and stock visible next to the action, makes scenario setup and repetition direct, and gives students a clear path from item → transaction → updated item → history evidence. The form should retain context after a validation message and should not hide the amount or selected item. On submission, show ordinary success or validation feedback without describing a testing defect or conclusion.

For repeatability, the modal should close after a successful transaction and the item detail should refresh. A “View history” link can lead to the existing history route. A dedicated inventory movement landing page is unnecessary because `/admin/inventory/history` already serves that purpose; filtering and a movement detail panel are useful expansions within it.

## 7. Stock History Design

Recommended default table, newest first:

| Field | C1 need | Stage-1 classification |
|---|---|---|
| Timestamp | Makes a movement identifiable and supports sequence/evidence. | Supporting realism; useful and low-cost. |
| Item code and item name | Identifies the subject of the evidence. | Source fixtures still identify the canonical item as `ITM-001`; Stage-1 evidence presents its public Kode Barang `BRG-001` and name. Internal database IDs stay hidden. |
| Type (Inbound / Outbound) | Identifies what transaction the quantity represents. | Needed to interpret C1 quantities as outbound; also supports inbound expansion. |
| Previous stock (`prevAmount`) | Explicitly required for history consistency and all HIS examples. | Source required. |
| Quantity (`amount`) | Explicitly required as a stored value and shown by all HIS examples. | Source required. |
| Resulting stock (`nextAmount`) | Explicitly required for consistency and all HIS examples. | Source required. |
| Actor | Not stated in C1. | Supporting realism; resolve `actorUserId` to display name. |
| Source | Not stated in C1. | Supporting realism; distinguish manual inbound/outbound. |
| Notes | Not stated in C1. | Supporting realism; optional transaction context. |
| Transaction code | Not stated in C1. | Supporting realism; show the public transaction code in the list/detail panel, not the internal movement key. |

The list must not display a PASS/FAIL column or explanatory labels. The student compares normal business data with requirements. Item and type filters plus search are available; a date range is optional. Movement detail shows actor, source, notes, public transaction code, and exact timestamp. Keep the friendly empty state. Store amounts as positive quantities and use `type` to express direction; `nextAmount` expresses the resulting stock. For example, the TC-03 outbound quantity remains 11 and its next stock is -1.

## 8. Item CRUD Expansion

Complete Item CRUD is an agreed Stage-1 realism expansion, not a C1 scenario:

- **List:** keep the current list, with search/filter if useful.
- **Add:** normal form and validation for required item fields; generate a unique immutable public Kode Barang in service logic.
- **View:** current detail route, with current stock and item metadata.
- **Edit:** normal field validation; do not modify historical movement values.
- **Delete/archive:** prefer archive (`isActive = false`) over physical deletion. This preserves item identity for existing stock movements and avoids broken history references. Archived records should remain accessible to history and, if needed, by direct detail link while being excluded from active inventory lists.

CRUD must behave as normal application functionality. No special C1 values or failure behavior belong in item forms. Movement records preserve item name and unit snapshots so historical history remains understandable after an item is renamed; archive protects item identity and its movement references.

## 9. Inbound Expansion

Stock Inbound is a supporting realism expansion, not required by C1. A credible inventory application should support both directions. Implement it as an item-scoped detail action with amount greater than zero, an increase to current stock, and a recorded movement. Invalid inbound values should be rejected normally. Inbound should not carry C1’s intentional observed mismatch; no C1 conclusion depends on inbound.

## 10. Reset / Repeatability

Use the already implemented Testing Utilities workflow between independent C1 cases:

1. Open Testing Utilities and choose Reset Testing Data.
2. Confirm the reset.
3. Verify public `BRG-001` (the canonical source fixture `ITM-001`, Kain Katun) is back at 10 meter and movement history is empty.
4. Open the item and perform exactly one case.
5. Inspect the resulting item stock and the matching history entry; record evidence (for example, student notes or screenshots) before another reset.
6. Reset before starting the next case.

Repeat that sequence for TC-01, TC-02, TC-03, and TC-04. Yes, reset should clear history: otherwise rows from earlier cases could be mistaken for current evidence. Reset is a lab convenience, not a business inventory action. The current reset implementation already clears users, items, and movements, reseeds the admin/items, and keeps the session usable because the restored admin ID is unchanged. A future hardening improvement is to make clear-and-reseed one atomic operation so an unexpected seed failure cannot leave an empty baseline.

## 11. Source-Derived Requirements vs Product Design Decisions

### Source-derived

- Outbound must be greater than zero (`REQ-STK-02`).
- Outbound must not exceed current stock (`REQ-STK-03`).
- Outbound equal to stock is valid; 10 from 10 results in 0 (`REQ-STK-04`, `TC-02`).
- TC-01: outbound 5 from 10 is accepted and results in 5.
- TC-03: expected rejection conflicts with observed processing; the observed stock becomes -1 and the student concludes FAIL.
- TC-04: zero is invalid and Submit nevertheless remains enabled; this proves the specified FAIL. The source does not establish persistence of a zero movement.
- History records `prevAmount`, `amount`, and `nextAmount` consistently; HIS-01, HIS-02, and HIS-03 give the concrete tuples.
- The application must expose evidence without giving students the root cause or a built-in PASS/FAIL conclusion.

### Product design decisions and agreed expansions

- For TC-04, if the enabled Submit is clicked, show an amount validation message and do not change stock or create a movement. This is a product decision, not source evidence.
- Keep zero enterable and Submit enabled at zero so the C1 observation remains possible.
- Keep the ten seed items and the source fixture mapping `ITM-001` → public `BRG-001` (Kain Katun) at 10 meter; broader dataset values remain a realism choice. The internal key is never part of student-facing evidence.
- Separate internal item/movement IDs from public codes. Use `BRG-001` for item-facing screens, search, filters, and detail/history URLs; use `TRX-STK-0001` for movement-facing history. Do not accept manually entered codes or allow item-code edits.
- Complete Item CRUD and Stock Inbound are Stage-1 expansions and should work normally.
- Use Dexie/IndexedDB, admin-only local auth, and Testing Utilities/reset as architecture and lab convenience decisions.
- Add realistic history context, filters, and detail view; do not put conclusions in history.
- The current Sesi 1 behavior reproduces TC-03 as a general over-stock validation gap affecting any item/amount where outbound exceeds current stock. It is not special-cased for `ITM-001` or amount 11.

## 12. Implementation Risks

- **Evidence must match stock:** update the item and write its movement in one IndexedDB read/write transaction so a failed write cannot leave a stock change without history or vice versa.
- **Do not accidentally mask TC-03:** generic max-stock validation would prevent the required observed C1 result. The current transaction flow preserves the specified over-stock observation without a case-specific branch.
- **Keep TC-04 failure visible:** disabling Submit at zero would remove the source’s explicit observation. Conversely, saving zero would invent evidence the source does not specify; the product decision is no write after click.
- **Keep conclusions with students:** transaction success/error feedback may describe application outcomes, but neither history nor the UI should say a test passed/failed or explain the underlying defect.
- **Keep history meaningful after item changes:** avoid physical deletion, and consider item-name/unit snapshots if movement history should retain original item labels after edits.
- **Repeat cases from a known baseline:** clear movement history on reset and verify stock 10 before each test. Preserve student evidence outside the resettable history.
- **Scope creep:** CRUD and inbound are agreed expansions, not C1 coverage requirements; do not let them delay the outbound/history evidence path.

## 13. Implementation Sequence (Completed)

The following sequence records the Sesi 1 implementation plan; all listed application work was complete and manually verified during Context 5 final QC.

1. Confirm the Stage-1 UX/data decisions: item-scoped movement drawer, movement row detail, archive policy, and TC-04 click behavior as specified here.
2. Complete normal Item CRUD and archive behavior so the inventory is a credible working area; do not add C1 failures to CRUD.
3. Add a transaction service that atomically updates stock and writes movement records with consistent `prevAmount`, `amount`, and `nextAmount`.
4. Add normal Stock Inbound and verify it records usable history.
5. Add Stock Outbound UI and the C1-specific observable behavior: 5 accepted, 10 accepted to zero, 11 processed to -1, and zero leaves Submit enabled but clicking shows feedback without a write.
6. Enrich Stock History to show the three quantities and enough business context; add filters/detail without PASS/FAIL labels.
7. Ensure Reset Testing Data restores all 10 baseline items/admin, clears movements, and retains the current session; make reset atomic if practical.
8. Manually execute each TC from a reset baseline and verify its corresponding history evidence (HIS-01, HIS-02, HIS-03) before preparing a later learning context.

The TC-03 behavior in step 5 must be a general rule gap for outbound amounts above stock, not logic keyed to a specific item or example quantity. No implementation is performed by this specification.

## 14. Coverage Completeness Gate

**CONTEXT 5 FINAL QC: YES.** All four outbound cases were executed independently through Item Detail, and history exposes the values needed for HIS-01 through HIS-03. TC-03 and TC-04 produce evidence from which the student concludes FAIL; the app does not show test conclusions.

**COVERAGE MEANING:** “COVERED” means the application provides the UI execution path and observable evidence required to perform the C1 exercise. It does not mean each business requirement passes. Students determine PASS/FAIL by comparing actual results with the requirements; the application does not provide the conclusion.
