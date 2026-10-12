# Techlith Lab — Session 6 Release Candidate Exercise

## Environment

This is a self-contained, deterministic, in-memory classroom project. It uses no database, backend, cloud service, Java, Python, Docker, or external defect tracker. It exercises two controlled release candidates against the shared canonical requirements.

## Prerequisites and commands

Use Node.js LTS and npm. From this folder run:

```sh
npm ci
npm run test:rc1
```

Run and record the RC1 execution before inspecting or comparing RC2. Capture the observed output and complete the failure investigation and defect report first. Then run the supplied candidate and the focused checks:

```sh
npm run test:rc2
npm run retest:rc2
npm run regression:rc2
npm run build
```

A test failure is evidence of an observed mismatch; it does not establish a root cause by itself. Record reproducible steps, expected behavior from the requirement, actual behavior from the run, and evidence before making a defect conclusion. Retest checks the specific behavior associated with a fix. Regression checks related behavior that could be affected.

## Requirements and scenario IDs

The exercise uses REQ-INV-001 through REQ-INV-006 without changing their meaning. The official execution cases are TC-INV-S6-001–TC-INV-S6-006. Their inputs and requirement-based expected behavior appear in the student portal and `tests/scenarios.ts`. Use the test IDs, release name, command output, and evidence references in the execution record. The test suite names state requirements and do not label an outcome in advance.

The release runner selects the candidate explicitly through `TECHLITH_RELEASE=RC1|RC2` and starts a real Vitest process. It reads the generated JSON result to report observed case statuses. A missing or invalid report, wrong case count, or process/report mismatch is an infrastructure error, separate from a test failure.

## Execution, evidence, and defect work

1. Run the named RC1 command before reviewing or comparing the other candidate.
2. Record each planned scenario, expected result, actual result, execution status, and evidence ID.
3. Investigate any failure with repeatable steps and observable evidence. A failure does not prove root cause.
4. Complete the blank defect report using `DEF-INV-S6-001` only when the evidence supports creating that record. Leave root cause unsupported/blank until evidence supports it.
5. After documenting the RC1 run and investigation, run RC2.
6. Retest the related case, then execute the regression set and summarize residual risk.

Use evidence IDs `EV-INV-S6-001` onward and maintain traceability among requirement, scenario, defect, and evidence. Do not record a result you did not observe.

## Carry-forward

Bring the improved tests and reusable assets from Session 5, together with Session 6 execution records, evidence, and defect tracking, into Session 7's final documentation and presentation work. This starter does not contain a completed summary, RTM, or final deliverable.

## Troubleshooting

- If dependencies are unavailable, run `npm ci` in this directory.
- Use the named commands so the intended release and test subset are selected.
- A runner infrastructure error means the result file or expected tests were not produced; do not record it as a test failure.
- If an expected result differs, preserve the command output and repeatable inputs before investigating further.
