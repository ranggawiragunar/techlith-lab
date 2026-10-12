# Techlith Lab — Session 5 Inventory Evaluation

## Environment

This is a self-contained classroom source derived from the canonical Session 3 reference rules. It is isolated from the Main Techlith Lab application and uses deterministic in-memory scenarios. It requires no database, cloud service, Java, Docker, or Firebase.

## Prerequisites and commands

Use Node.js LTS and npm. From the extracted `session-5-inventory-evaluation` folder, install dependencies and run the fixed official baseline first:

```sh
npm install
npm run test:baseline
npm run coverage:baseline
npm run mutation:baseline
```

The `:baseline` commands run only `tests/baseline/`, even after you add your own tests. Add student tests under `tests/improved/`. Active commands include the current suite:

```sh
npm run test
npm run coverage
npm run mutation
npm run build
```

`npm ci` is also available for lockfile-exact installation.

## Baseline reference

The fixed baseline reports 88% scoped statement coverage, 72% scoped branch coverage, and 50% controlled mutation score (M01/M03 killed; M02/M04 survived). These are official starter observations, not your improved-suite results. Coverage uses Vitest V8 data and a transparent scoped calculation in `scripts/scoped-coverage.mjs`. Mutation status comes from actual Vitest runs; infrastructure errors are reported separately.

## Practical workflow

1. Run the three baseline commands and record the output and sources.
2. Inspect uncovered statements/branches, survived mutants, model evidence, and the Session 4 improvement plan.
3. Add your tests under `tests/improved/`; do not change canonical rules to force a result.
4. Run the active test, coverage, and mutation commands; compare your evidence with the baseline.
5. Fill the matching blank templates under `work-products/planning/`, `design/`, `execution/`, `metrics/`, `findings/`, `evidence/`, and `reusable-assets/`.

Target, not a prefilled result: all tests pass, scoped statement and branch coverage reach 100%, and 4/4 controlled mutants are killed. Record any remaining gap.

## Canonical rules and state evidence

The canonical requirements are REQ-INV-001 (outbound > 0), REQ-INV-002 (outbound <= current stock; exact-stock valid), REQ-INV-003 (pcs/unit integer), REQ-INV-004 (fractional units up to 3 decimals), REQ-INV-005 (ARCHIVED rejects movement and history remains available), and REQ-INV-006 (prev/amount/next consistency). Baseline evidence includes zero rejection, fractional pcs rejection, archived rejection, valid movement consistency, and state orientation. Your active suite should investigate exact-stock, four-decimal precision, restore to ACTIVE, movement after restore, history availability through archive/restore, and cross-state consistency.

`src/inventoryRules.ts` exposes the tutorial-compatible `validateOutbound(stock, amount, unit, isActive?)` API and retains `applyOutbound(...)`. `src/itemState.ts` and `mutants/manifest.json` provide the tutorial names while preserving the existing readable implementation.

## Work products

Matching blank copies of the published templates are included under `work-products/`:

- `planning/`
- `design/`
- `execution/`
- `metrics/`
- `findings/`
- `evidence/`
- `reusable-assets/`

Bring your improved suite, reusable assets, evidence discipline, and completed work products forward to Session 6.

## Troubleshooting

- Run commands from the extracted project root and use Node.js LTS with npm.
- If coverage output is stale, rerun `npm run coverage` and inspect `coverage/` plus the scoped calculation.
- If mutation reports an infrastructure error, check installation and rerun before interpreting a mutant status.
- Baseline commands should remain stable when student tests are added; active commands intentionally include them.
