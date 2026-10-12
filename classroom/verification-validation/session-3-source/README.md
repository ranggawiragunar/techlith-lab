# Techlith Lab — Session 3 Inventory Classroom

This standalone project is a small **reference classroom rule set** aligned with the canonical inventory requirements. It is **not a byte-for-byte snapshot of the Main Techlith Lab application**. The two environments have different roles: Sessions 1–2 use the Main Application; Session 3 studies this isolated source project. The Session 1 over-stock observation does not define this reference rule: outbound quantity here follows the requirement and cannot exceed current stock. This is not presented as a “fixed version of the bug.”

## Prerequisites

- Node.js LTS
- npm (included with Node.js)

No database, cloud service, Java, Python, Docker, or Firebase Emulator is needed.

## Install and run

```bash
npm install
npm run test
npm run coverage
npm run mutation -- --list
npm run build
```

`npm ci` is also available when you want an install exactly from the lockfile. The official starter includes a small, deliberately incomplete four-case baseline. It is an orientation point, not a complete requirement suite. Add your own tests under `tests/`; active `npm run test`, `coverage`, and `mutation` include those tests. Session 3 has no normalized percentage target.

To view the small reference page locally:

```bash
npm run dev
```

## Make your own tests

Create test files under `tests/`. Suggested starting points:

```text
tests/
├── inventoryRules.test.ts
├── quantityRules.test.ts
├── inventoryState.test.ts
└── usageBased.test.ts
```

### Task A — Code-based

Read the small rule functions and write tests for selected canonical requirements and boundaries carried forward from Session 2. Candidate IDs `TC-INV-001`–`TC-INV-006` may inform your work; you do not need to translate every candidate into a one-to-one unit test. Choose input, expected result, and evidence from the requirement.

### Task B — Fault-based

1. List the controlled variants with `npm run mutation -- --list`.
2. Design a test that distinguishes a mutant from the reference behavior.
3. Run your suite against one variant with `npm run mutation -- --mutant M02` (replace M02 with a listed ID).
4. Run all variants with `npm run mutation -- --summary` and record the observed output.
5. Mutation status comes from Vitest execution of your current tests; infrastructure errors are reported separately.

The starter reports outcomes from actual test runs; it does not prefill a normalized outcome or score.

### Task C — Usage-based

Read `src/usageProfile.ts`. Use the classroom operational profile to prioritize scenarios by frequency and risk. This profile is a classroom exercise input, not observed production telemetry.

### Task D — Model-based

Use `src/inventoryState.ts` to derive tests for `ACTIVE`, `ARCHIVED`, archive, restore, and movement eligibility. The state model has no persistence layer.

### Task E — Evidence

Run your tests and coverage command. Record commands, observed output, test IDs, evidence references, and any notes in the practical record. Explain actual behavior in your evidence; derive expected behavior from requirements.

## Source map

- `src/types.ts` — inventory, movement, state, and usage types.
- `src/quantityRules.ts` — positive quantity, decimal precision, and unit domain rules.
- `src/inventoryRules.ts` — `validateOutbound(stock, amount, unit, isActive?)` and the compatible item-based `applyOutbound(...)` API.
- `src/inventoryState.ts` / `src/itemState.ts` — in-memory archive/restore transitions and movement eligibility, with tutorial-compatible exports.
- `src/usageProfile.ts` / `src/operationalProfile.ts` — classroom operational profile and tutorial-compatible exports.
- `src/mutants/M01.ts`–`M04.ts` — isolated controlled rule changes for fault-based reasoning.
- `mutants/manifest.json` — mutant IDs and descriptions without outcomes.
- `tests/inventoryRules.baseline.test.ts` — four intentionally incomplete official starter cases.
- `scripts/run-mutation.mjs` — stable mutation command interface.
- `src/main.ts` — small source orientation page; this is not a duplicate inventory UI.
- `tests/README.md` — student-owned test workflow.

## Classroom operational profile

| Activity | Frequency |
| --- | ---: |
| View Inventory | 35% |
| Stock Inbound | 25% |
| Stock Outbound | 25% |
| Stock History | 10% |
| Archive / Restore | 5% |
| **Total** | **100%** |

## State model

```text
ACTIVE --archive--> ARCHIVED
ARCHIVED --restore--> ACTIVE
```

Archived items reject new movements; their historical records remain available in the inventory domain. This small source models item state in memory and has no database.

## Controlled mutants

- **M01** changes the positive-quantity boundary so zero may pass.
- **M02** changes the stock comparison so exact-stock may be rejected.
- **M03** bypasses whole-number unit validation.
- **M04** permits a fourth decimal place.

These are deliberate exercise variants. No result or mutation score is provided in the starter.

## Expected student outputs

- Tests you authored under `tests/`.
- Requirement and boundary reasoning.
- Fault-based test ideas and observed mutant differences.
- A usage-based scenario priority with a reason.
- State transition tests and recorded evidence.

Session 4 will read and interpret evidence from this work. This starter does not provide Session 4's evidence pack or conclusions.
