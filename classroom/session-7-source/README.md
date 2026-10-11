# Session 7 — Final Regression dan Release Readiness

**SUT:** Techlith Inventory Core — Final Release Classroom Build

**Course:** Pengujian Perangkat Lunak · **Duration:** approximately 90 minutes

This standalone React/Vite classroom build supports final smoke testing, risk-based manual regression, selected automated regression, RTM preparation, defect and residual-risk review, and a tester release recommendation. It is for **supervised local classroom use only**.

## Learning objectives

- Run a smoke gate before the final regression cycle.
- Select regression cases by requirement and risk.
- Execute a deterministic automated domain regression suite.
- Compare stock, stocktaking records, and item history in Firestore.
- Record traceability, unresolved defects, residual risks, and a reasoned recommendation.

## Prerequisites and local-only boundary

- Node.js 24 LTS is the preferred classroom runtime. Java 21 or newer is required by the Firestore Emulator.
- Install dependencies in this directory using `npm ci`.
- Firebase demo project: `demo-techlith-inventory-session-7`.
- React: `http://127.0.0.1:3000`; Firestore Emulator: `127.0.0.1:8080`; Emulator UI: `http://127.0.0.1:4000`.
- The app binds to loopback, connects directly to the local emulator, and has no production fallback, production credentials, or deployment script.
- Do not expose emulator ports publicly. Do not use production credentials. Do not run Session 5, 6, and 7 emulators concurrently because they use the same ports.

The tutorial uses `npm install`, which resolves dependencies from the manifest and may update the lockfile. This project recommends `npm ci`: it installs the exact versions recorded by `package-lock.json`, fails if the lockfile and manifest disagree, and does not rewrite the lockfile. Use `npm ci` for a repeatable classroom setup.

## Install and run

From `classroom/session-7-source/`:

```sh
npm ci
npm run emulators
```

In another terminal, still in this directory:

```sh
npm run seed
```

In a third terminal:

```sh
npm run start
```

Open the React app at `http://127.0.0.1:3000`. Open the Firestore Emulator UI at `http://127.0.0.1:4000` to inspect persisted emulator documents. Stop each process with Ctrl+C when finished.

### Seed dataset and reset behavior

The guarded seed expects the Session 7 demo project and loopback emulator configuration, rejects unexpected project/environment credential configuration, checks emulator reachability, and verifies the resulting dataset. It deletes documents **only** from the intended `stocktakings` and `items` collections before restoring this baseline:

| Kode Barang | Nama | Stok | amountType | History |
| --- | --- | ---: | --- | --- |
| ITM-001 | Kain Katun | 10 | meter | empty |
| ITM-002 | Benang Hitam | 5 | roll | empty |
| ITM-003 | Resleting | 100 | pcs | empty |

`stocktakings` contains zero documents after seed. Reseeding deletes classroom test data in those two collections; save any evidence needed before reseeding. No duplicate `unit` field is introduced.

## Test workflow

### 1. Final smoke gate

Start from a fresh seed, then execute FSMK-01 through FSMK-05 in order. Do not reseed between FSMK-03 and FSMK-04. Record observations in `templates/Final_Regression_Record.csv`. A critical smoke failure or blocked case stops the final regression workflow until investigated; do not proceed and do not mark it as passed automatically. Reseed after smoke completes.

### 2. Manual regression

Reseed before each independent case requiring stock 10. For REG-F-05, seed once, perform inbound 5 followed by outbound 3, then verify final stock 12, two stocktaking documents, and two history references. REG-F-01 enters zero through the UI: the form intentionally has no positive minimum, so the application/domain rule can reject it. Note whether rejection came from browser validation, application validation, or the domain service, and confirm that Firestore did not mutate.

Use the UI's failure selector for REG-F-07. Start each normal/failure scenario from a separate seeded baseline. `stocktaking-write` fails before a transaction write is buffered; `item-update` fails after the stocktaking write is buffered but before the item update. Firestore `runTransaction` must abort all writes in either case. Check runtime messages against actual emulator documents; an error message alone is not data evidence.

### 3. Selected automated regression

Run without starting the emulator:

```sh
npm run regression
```

The Node built-in `node:test` suite imports the same production ESM domain module used by the transaction service and Data Inspector. It reports individual cases and pass/fail totals. A nonzero exit indicates the regression run failed. REG-F-06 uses this selected product validation automation; no product-management UI is included.

For implementation checks, run:

```sh
npm run typecheck
npm run build
```

## Data inspection and consistency indicator

The read-only Data Inspector shows item codes, current stock, `amountType`, history references, transaction codes, operation, amount, before/after amounts, and created time. Its consistency banner and per-record indicator apply the shared record arithmetic/reference oracle to the currently observed documents. This is an aid for inspecting observed data; it is not the student's overall PASS/FAIL verdict and does not fill evidence templates.

## Evidence, RTM, defects, and recommendation

Capture case ID, precondition, action, expected result, actual observation, status, evidence location, and Firestore verification. Screenshots should show enough context to identify the case and the relevant record(s); redact nothing by inventing missing evidence. Keep actual outcomes blank until personally observed.

Use `templates/Final_RTM.csv` to map REQ-STK-01, REQ-STK-03, REQ-STK-04, REQ-HIS-01, REQ-HIS-02, product validation, partial-write/false-success risk, and the acceptance critical flow to S3/S5/S6/S7 evidence. Historical IDs are navigation hints only; locate and verify source evidence. Missing evidence is not PASS.

Use `templates/Open_Defect_Residual_Risk_Review.csv` for BUG-S3-01, BUG-S5-01, new Session 7 defects, and out-of-scope sales/customer dependencies. A historical defect is not closed without retest evidence. Use `templates/Final_Test_Summary.md` to report the build, run totals, unresolved critical/high defects, highest residual risk, RTM coverage, and one recommendation: RECOMMENDED, RECOMMENDED WITH CONDITIONS, or NOT RECOMMENDED YET. A high pass percentage cannot override a critical regression failure.

## Runtime and security restrictions

Use only the local Session 7 demo emulator. Do not add production configuration or credentials, deploy emulator rules, expose services beyond loopback, or run deployment commands. The package's Node engine targets 24.x. If your available runtime differs, report that limitation and do not claim supported-runtime verification. This build's Node 24 status must be established in the environment where it is run.

## Cleanup

Stop Vite and Firebase Emulator processes with Ctrl+C. Confirm no emulator or app server remains active. Preserve the standalone source and completed classroom evidence, then keep generated dependency/build folders out of any later teaching package unless its packaging instructions explicitly require them.

## Troubleshooting

- **Seed refuses to run:** verify `.firebaserc`, Firebase emulator host/port, environment project variables, and that production credential variables are absent. Start the emulator first.
- **App says it is waiting:** check that Firestore Emulator is running on `127.0.0.1:8080`, then reload. The app intentionally does not fall back to production.
- **Port already in use:** stop other classroom app/emulator processes before retrying; do not change the public binding.
- **Java/Node engine warning:** use Java 21+ and Node 24 for the supported classroom runtime; do not replace system runtimes as part of this exercise.
- **Regression command fails:** retain the full terminal output, identify the failing case, and record it as actual evidence. Do not weaken the test to obtain a green result.
