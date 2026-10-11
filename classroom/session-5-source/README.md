# Session 5 — Firestore Emulator Classroom Build

Standalone student application for the Session 5 integration-testing lab. It uses a real Firestore Emulator and is isolated from the Techlith Lab portal and its IndexedDB data.

## Safety boundary

This project uses only the demo project ID `demo-techlith-inventory-classroom` and the local Firestore Emulator at `127.0.0.1:8080`. The browser app refuses to run on a non-local hostname. It has no production Firebase configuration, service account, or login flow, and it has no deploy script. Do not connect this build to Firebase production. **Never deploy `firestore.rules`; those permissive rules are for the isolated local classroom emulator only.**

The Firestore Emulator requires Java 21 or later with the installed Firebase CLI. Before starting it, verify that `java -version` reports Java 21 or later. This project does not change system Java settings.

## Requirements

- Node.js 24 LTS is recommended for a new classroom setup. `firebase-tools` resolves `superstatic@10.0.0`, which declares Node.js 20, 22, or 24. The S5-4 runtime check used Node.js 23.4.0 successfully, but that major is outside the declared range; Node.js 24 has not been runtime-tested with this classroom build.
- npm.
- Java 21 or later.
- A free local port 3000, 8080, and 4000.
- No Firebase login or production credentials.

## Setup

From this directory, install the standalone dependencies:

```sh
npm install
```

Open two terminals in this directory.

**Terminal 1 — Firestore Emulator:**

```sh
npm run emulators
```

The command explicitly starts only Firestore with project `demo-techlith-inventory-classroom`. Firestore binds to `127.0.0.1:8080`; Emulator UI binds to `127.0.0.1:4000`.

**Terminal 2 — reset data and start the app:**

```sh
npm run seed
npm start
```

The seed script verifies the emulator endpoint/project guard before deleting and recreating only the `items` and `stocktakings` collections. It stops if the required local emulator is unreachable or an unexpected project/host is configured.

Open the app at <http://localhost:3000> and Emulator UI at <http://127.0.0.1:4000>. Vite uses strict port handling and exits instead of silently moving to another port.

## Baseline dataset

| Kode Barang | Name | Amount | Unit |
|---|---|---:|---|
| ITM-001 | Kain Katun | 10 | meter |
| ITM-002 | Benang Hitam | 5 | roll |
| ITM-003 | Resleting | 100 | pcs |

Each item has an empty `stocktakingHistory` array after reset. The `stocktakings` collection is empty. No student test result or defect conclusion is seeded.

Run `npm run seed` before a scenario that requires the baseline. The app never resets data automatically. It does not provide a reset button that could target another database.

## Classroom workflow

The form lets students select an item, choose `inbound` or `outbound`, enter an amount, choose `Baseline` or `Reference Safe Flow`, and select `Normal`, `stocktaking-write`, or `item-update` failure injection. The app displays runtime messages but does not grade a test, decide PASS/FAIL, or fill student documentation.

Inspect actual `items` and `stocktakings` documents in the app and Emulator UI. Item history references are displayed as stored. The inbound/outbound report reads actual documents from `stocktakings`; a missing document is not reconstructed from the form.

Failure injection rejects the selected write boundary in the transaction path. Other attempted writes, including rollback, use the real Firestore Emulator. The two implementation flows are deliberately separate so students can compare the source-like baseline with the reference safe flow.

## Troubleshooting

- **Java or emulator startup error:** check `java -version` and use a Java release supported by the installed Firebase Emulator Suite. Do not change system Java as part of the classroom exercise.
- **Port already in use:** close the process that owns the conflicting classroom port or resolve it with the instructor. The app will not select another Vite port automatically. Do not stop unrelated applications.
- **Seed says emulator is unavailable:** start Terminal 1 and wait for Firestore to report ready before running `npm run seed`.
- **App says emulator is unavailable:** confirm the Firestore Emulator is running on `127.0.0.1:8080`; the app has no production fallback.
- **Unexpected data:** inspect both collections and run `npm run seed` only when ready to reset the classroom dataset.

## Stop local processes

Press `Ctrl+C` in each terminal running `npm run emulators` or `npm start`. No emulator data export is part of this exercise.
