# Techlith Lab — Session 5 Suite Evaluation Starter

## Environment boundary

This self-contained, isolated classroom source inherits the canonical reference rules from Session 3 at `classroom/verification-validation/session-3-source/src/`. It is an isolated classroom environment, not a byte-for-byte snapshot of the Main Techlith Lab application. Its small scenario layer is deterministic and in-memory. No database, Firebase, Java, Docker, or cloud service is used.

## Prerequisites and commands

Use Node.js LTS and npm. From this folder run:

```sh
npm ci
npm test
npm run coverage
npm run mutation
npm run build
```

`npm test` runs the official baseline suite. Student tests belong under `tests/` or `tests/student/`. No instructor answer suite is included.

## Baseline evidence

The official starter is designed to report scoped course coverage of 88% statements and 72% branches, plus a 50% controlled mutation score: M01 and M03 are killed; M02 and M04 survive. Coverage uses Vitest's V8 provider and a transparent calculation from its machine-readable report; inspect both the raw HTML/text report and the scope definition in `scripts/scoped-coverage.mjs`. Scoped metrics describe the declared course source files and are not a verdict on overall quality.

The mutation harness runs real Vitest processes against reference and controlled variants selected through `TECHLITH_MUTANT`. A failing test process means KILLED; a passing process means SURVIVED. Infrastructure errors are reported separately and return non-zero. The four controlled distinctions are zero positivity (M01), exact-stock (M02), whole-number unit validation (M03), and 3-versus-4 decimal places (M04).

## Practical workflow

1. Run the baseline commands and record actual output.
2. Inspect uncovered source and branch evidence, survived mutants, and the Session 4 improvement plan.
3. Add your own tests; do not change reference business rules to force a pass.
4. Rerun test, coverage, and mutation commands, then compare evidence.
5. Complete the planning, design, execution, metrics, findings, evidence, and reusable-asset templates.

Acceptance target (a target, not a prefilled result): all tests pass, scoped statement and branch coverage reach 100%, and all four controlled mutants are killed. If a target is not reached, record the remaining evidence gap.

## Canonical rules and state gaps

The inherited requirements are REQ-INV-001 (outbound > 0), REQ-INV-002 (outbound <= stock, exact-stock valid), REQ-INV-003 (pcs/unit integer), REQ-INV-004 (fractional units up to 3 decimals), REQ-INV-005 (ARCHIVED rejects movement while prior history remains available), and REQ-INV-006 (successful movement preserves previous/amount/next consistency). Baseline evidence includes archived rejection. Students should inspect coverage and develop evidence for exact-stock, four-decimal precision, restore to ACTIVE, movement after restore, history availability across archive/restore, and cross-state consistency. These are evidence gaps, not confirmed defects.

Scoped statement coverage reads V8 statement counters for `inventoryRules.ts` and `quantityRules.ts`, excluding only the fixed precision configuration declaration. Its 25-statement denominator is visible in `scripts/scoped-coverage.mjs`. Scoped branch coverage reads all authored decision slots from those rule files except V8's synthetic destructuring-default counters, then includes the scenario outbound result and three state-action cases; this produces a 25-branch denominator. Every numerator comes from actual V8 counters in `coverage/coverage-final.json`. Both scopes and exclusions are explicit in the script. Raw V8 reports remain available under `coverage/`. Raw V8 reports remain available under `coverage/`. Generated reports and build output are excluded from the source ZIP.

## Work products and carry-forward

Use the blank templates in the work-products pack for test planning, design, execution, metrics, findings, evidence indexing, and reusable assets. Bring the improved suite, reusable tests/assets, evidence discipline, and completed work products forward to Session 6 for execution, defect handling, retest, and regression.

## Troubleshooting

- If dependencies are missing, rerun `npm ci` in this folder.
- If coverage output is stale, rerun `npm run coverage`; inspect the V8 HTML report and machine-readable JSON.
- If mutation reports an infrastructure error, verify `npm ci` completed and rerun the command.
- If your result differs from the baseline, check that you are using the official starter and have not yet added student tests.
