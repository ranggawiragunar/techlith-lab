# Techlith Lab — Session 6 Inventory Execution

## Environment and fixture

This is a self-contained, deterministic, in-memory release-candidate exercise. It does not use a database, backend, cloud service, Java, Python, Docker, or external defect tracker. The canonical pcs fixture is `BRG-LAB-PCS` / `Button Black` / `pcs` / stock `10`; the meter case uses a separate fixture.

## Install and execute

Use Node.js LTS and npm. From the extracted `session-6-inventory-execution` folder:

```sh
npm install
npm run test:execution:rc1
```

Record the RC1 command output and complete your failure investigation and defect report before executing the next candidate. Then run:

```sh
npm run test:execution:rc2
npm run test:regression:rc2
```

The optional focused retest and build commands are:

```sh
npm run retest:rc2
npm run build
```

Compatibility aliases `test:rc1`, `test:rc2`, and `regression:rc2` are also available. The tutorial-named commands above are the stable student interface.

## Requirements and scenarios

The exercise uses REQ-INV-001 through REQ-INV-006 and official cases TC-INV-S6-001–TC-INV-S6-006. Scenario inputs and requirement-based expected behavior are available in `tests/scenarios.ts`. Capture actual observations and evidence separately; do not record a result you did not observe.

The runner selects RC1 or RC2 through `TECHLITH_RELEASE` and starts a real Vitest process. It reads the resulting JSON report. Missing or invalid reports and case-count mismatches are infrastructure errors, separate from test failures.

## Source map

- `builds/rc1/` and `builds/rc2/` — release selection notes.
- `fixtures/inventory.ts` — deterministic pcs and meter fixtures.
- `tests/execution.spec.ts`, `tests/retest.spec.ts`, `tests/regression.spec.ts` — official test sets.
- `src/` — shared reference and candidate rule logic.
- `scripts/run-suite.mjs` — release-aware test runner.
- `work-products/` — blank planning, execution, defect, retest, reporting, and evidence materials.

## Evidence and defect work

Record release, test ID, requirement, precondition, input, expected and actual behavior, reproducible steps, and evidence. A test failure is an observation; it does not prove a root cause. Link requirement → test → evidence → defect when supported → retest/regression. Leave unsupported defect and root-cause claims blank. Run regression after the focused retest and summarize limitations from your own evidence.

Bring your Session 5 improved suite and reusable assets together with Session 6 execution records and evidence into Session 7's Final Software Testing Document. Session 7 templates remain student-owned and blank.
